import { Snippet } from '@/lib/types'
import { ArrowRight } from 'lucide-react'
import SnippetCard from './template_card'
import { Button } from './ui/button'
import { featuredSnippets } from '@/lib/data'
import Link from 'next/link'
import MovementWrapper from '@/hoc/Animation/movementWrapper'


const FeaturedSnippets = () => {
    return (
        <>
            <div className='flex flex-col gap-[12px] h-[60vh]'>
                <header className='flex min-w-full justify-between'>
                    <main className='flex flex-col gap-[12px]'>
                        <h2 className="text-3xl font-bold">Featured Snippets</h2>
                        <p>Some of the best snippets.</p>
                    </main>
                    <aside>
                        <Link href="/snippets">
                            <Button variant="ghost">
                                View All
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </aside>
                </header>
                <MovementWrapper direction='up' triggerOnScroll={true} delay={.8}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredSnippets?.map((snippet: Snippet) => (
                            <SnippetCard key={snippet.id} snippet={snippet} />
                        ))}
                    </div>
                </MovementWrapper>
            </div>
        </>
    )
}

export default FeaturedSnippets