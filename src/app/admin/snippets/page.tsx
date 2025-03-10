"use client";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import SectionWrapper from '@/hoc/sectionWrapper';
import { showToast } from '@/lib'; // Assume you have a toast notification system
import { DELETE_SNIPPET, GET_ALL_SNIPPETS_ADMIN } from '@/lib/services';
import { Snippet } from '@/lib/types';
import { useAppDispatch } from '@/redux/redux-hooks';
import { setSnippets } from '@/redux/slice/snippetSlice';
import { useMutation, useQuery } from '@apollo/client';
import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const SnippetAdminPage = () => {
    const [deleteSnippet] = useMutation(DELETE_SNIPPET, {
        refetchQueries: ["GetAllSnippets"],
    });
    const dispatch = useAppDispatch();
    const { data, loading } = useQuery(GET_ALL_SNIPPETS_ADMIN);
    useEffect(() => {
        if (!loading && data.getAllSnippets.snippets) {
            dispatch(setSnippets(data.getAllSnippets.snippets));
        }
    }, [data]);
    const handleDelete = async (id: string) => {
        try {
            await deleteSnippet({ variables: { deleteSnippetId: id } }).then(() => {
                showToast('Snippet deleted successfully', 'success');
            }).catch(err => {
                console.log(err);
            })

        } catch (error) {
            console.error(error);
            showToast('Failed to delete snippet', 'error');
        }
    };
    if (loading) {
        return <div>Loading</div>
    }
    return (
        <SectionWrapper>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Coding Snippets</h1>
                </div>

                <div className="bg-white rounded-lg shadow">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Language</TableHead>
                                <TableHead>Topic</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.getAllSnippets.snippets.map((snippet: Snippet) => (
                                <TableRow key={snippet.id}>
                                    <TableCell className="font-medium">
                                        <Link className='hover:text-blue-500' href={`/snippet/${snippet?.id}`}>{snippet.title}</Link>

                                    </TableCell>
                                    <TableCell>
                                        <p className='flex flex-wrap'>{snippet.description?.slice(0, 40)}...</p>
                                    </TableCell>
                                    <TableCell>
                                        <Badge>{snippet.language}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {Array.isArray(snippet.tags) ? snippet.tags.map((tag: string) => (
                                                <Badge key={tag} variant="outline">
                                                    {tag}
                                                </Badge>
                                            )) : <Badge variant="outline">No Tags</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">

                                            <Button
                                                onClick={() => handleDelete(snippet.id)}
                                                variant="destructive"
                                                size="sm"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </SectionWrapper>
    )
}

export default SnippetAdminPage
