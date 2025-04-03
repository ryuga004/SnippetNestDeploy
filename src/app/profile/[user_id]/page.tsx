"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/redux-hooks";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SectionWrapper from "@/hoc/sectionWrapper";
import { showToast } from "@/lib";
import {
  GET_USER_BY_ID,
  UPDATE_USER,
  UPDATE_USER_SOCIAL,
} from "@/lib/services";
import { fetchUser } from "@/redux/slice/userSlice";
import { useMutation, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import {
  ActivityIcon,
  AlertCircleIcon,
  BookmarkIcon,
  CameraIcon,
  CheckCircleIcon,
  GithubIcon,
  LinkedinIcon,
  PencilIcon,
  TrophyIcon,
  TwitterIcon,
  UserIcon,
} from "lucide-react";

interface ProfileUserType {
  id: string;
  avatar: string;
  coverImage?: string;
  points: number;
  bio?: string;
  username: string;
  email: string;
  social?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
  stats: {
    contributions: number;
    rank: number;
    problemSolved: number;
  };
  achievements: Array<{
    id: string;
    title: string;
    icon: string;
    date: string;
  }>;
}

const ProfilePage = () => {
  const { user_id } = useParams() as { user_id: string };
  const { user } = useAppSelector((state) => state.user);
  const [editingSocial, setEditingSocial] = useState(false);
  const [editingBio, setEditingBio] = useState<boolean>(false);
  const isOwner = user.id === user_id;
  const dispatch = useAppDispatch();
  const [socialInputs, setSocialInputs] = useState({
    github: "",
    twitter: "",
    linkedin: "",
  });
  const { data, loading, refetch } = useQuery(GET_USER_BY_ID, {
    variables: { id: user_id },
    skip: !user_id,
  });
  const owner: ProfileUserType = data?.getUserById?.user;
  const [editingBioInput, setEditingBioInput] = useState<string>(
    owner?.bio ? owner.bio : ""
  );
  const recentSubmissions = useMemo(() => {
    return [];
  }, [data, owner]);
  useEffect(() => {
    if (owner) {
      setSocialInputs({
        github: owner.social?.github || "",
        twitter: owner.social?.twitter || "",
        linkedin: owner.social?.linkedin || "",
      });
      setEditingBioInput(owner.bio ? owner.bio : "");
    }
  }, [owner]);
  const submissions = useAppSelector((state) => state.submissions.submissions);
  const [upadateUser] = useMutation(UPDATE_USER);
  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover"
  ) => {
    showToast(
      "Uploading image... \n Please wait while we process your image",
      "info"
    );
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const NewformData = new FormData();
    NewformData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: NewformData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      if (owner && data) {
        const updatedUser = await upadateUser({
          variables: {
            updateUserId: owner.id,
            input: {
              avatar: type === "avatar" ? data.secure_url : owner.avatar,
              coverImage: type === "cover" ? data.secure_url : owner.coverImage,
            },
          },
        });
        if (updatedUser.data.updateUser.success) {
          showToast("Image uploaded successfully", "success");
          dispatch(fetchUser());
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  const [updateUserSocial] = useMutation(UPDATE_USER_SOCIAL);
  const handleSocialUpdate = async () => {
    if (owner) {
      const updatedUserSocial = await updateUserSocial({
        variables: {
          input: {
            github: socialInputs.github || owner.social?.github,
            twitter: socialInputs.twitter || owner.social?.twitter,
            linkedin: socialInputs.linkedin || owner.social?.linkedin,
          },
        },
      });
      if (!updatedUserSocial?.data?.updateUserSocial?.success) {
        showToast("Failed to update social links", "error");
      } else {
        showToast("Your social links have been updated.", "success");
      }
    }
    setEditingSocial(false);
    refetch();
  };

  const statsCards = [
    {
      title: "Contributions",
      value: owner?.stats.contributions || 0,
      icon: ActivityIcon,
    },
    { title: "Rank", value: owner?.stats.rank || 0, icon: UserIcon },
    {
      title: "Problem Solved",
      value: owner?.stats.problemSolved || 0,
      icon: UserIcon,
    },
    { title: "Points", value: owner?.points || 0, icon: TrophyIcon },
  ];

  if (loading) {
    return (
      <SectionWrapper>
        <div className="max-w-4xl mx-auto p-4 space-y-6">
          <Skeleton className="w-full h-52 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="w-28 h-28 rounded-full mx-auto" />
            <Skeleton className="w-48 h-6 mx-auto" />
            <Skeleton className="w-96 h-4 mx-auto" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }
  const handleBioUpdate = async () => {
    if (owner) {
      const updatedUser = await upadateUser({
        variables: {
          updateUserId: owner.id,
          input: {
            bio: editingBioInput,
          },
        },
      });
      if (!updatedUser.data.updateUser.success) {
        showToast("Failed to update bio", "error");
      } else showToast("Your bio has been updated.", "success");
    }
    refetch();
    setEditingBio(false);
  };
  return (
    <SectionWrapper>
      <main className="max-w-4xl mx-auto p-4 space-y-6">
        <Card className="overflow-hidden rounded-2xl shadow-lg relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-52 bg-cover bg-center relative group"
            style={{ backgroundImage: `url(${owner?.coverImage})` }}
          >
            {isOwner && (
              <>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(event) => handleImageUpload(event, "cover")}
                />

                <label
                  htmlFor="cover-upload"
                  className="absolute top-2 right-2 cursor-pointer z-50  hover:opacity-100 transition-opacity"
                >
                  <CameraIcon className="w-5 h-5" />
                </label>
              </>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </motion.div>

          <CardContent className="relative p-6">
            <div className="relative inline-block">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Avatar className="w-28 h-28 mx-auto -mt-16 border-4 border-white rounded-full shadow-lg">
                  <AvatarImage src={owner?.avatar} alt={owner?.username} />
                  <AvatarFallback>{owner?.username.charAt(0)}</AvatarFallback>
                </Avatar>
                {isOwner && (
                  <>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(event) => handleImageUpload(event, "avatar")}
                    />

                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-2 cursor-pointer   hover:opacity-100 transition-opacity"
                    >
                      <CameraIcon className="w-5 h-5" />
                    </label>
                  </>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center mt-4"
            >
              <h1 className="text-2xl font-bold">{owner?.username}</h1>
              <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1">
                {owner?.bio ? owner.bio : isOwner ? "add a bio" : ""}
                {isOwner && (
                  <Dialog open={editingBio} onOpenChange={setEditingBio}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Bio </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Textarea
                            id="bio"
                            value={editingBioInput}
                            onChange={(e) => setEditingBioInput(e.target.value)}
                            placeholder="Write something about yourself..."
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setEditingBio(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleBioUpdate}>Save Changes</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {owner?.email}
              </p>

              <div className="flex justify-center gap-3 mt-4">
                {owner?.social?.github && (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={owner.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GithubIcon className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                {owner?.social?.twitter && (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={owner.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <TwitterIcon className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                {owner?.social?.linkedin && (
                  <Button variant="ghost" size="icon" asChild>
                    <a
                      href={owner.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LinkedinIcon className="w-5 h-5" />
                    </a>
                  </Button>
                )}
                {isOwner && (
                  <Dialog open={editingSocial} onOpenChange={setEditingSocial}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Social Links</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="github">GitHub URL</Label>
                          <Input
                            id="github"
                            value={socialInputs.github}
                            onChange={(e) =>
                              setSocialInputs({
                                ...socialInputs,
                                github: e.target.value,
                              })
                            }
                            placeholder="https://github.com/username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="twitter">Twitter URL</Label>
                          <Input
                            id="twitter"
                            value={socialInputs.twitter}
                            onChange={(e) =>
                              setSocialInputs({
                                ...socialInputs,
                                twitter: e.target.value,
                              })
                            }
                            placeholder="https://twitter.com/username"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn URL</Label>
                          <Input
                            id="linkedin"
                            value={socialInputs.linkedin}
                            onChange={(e) =>
                              setSocialInputs({
                                ...socialInputs,
                                linkedin: e.target.value,
                              })
                            }
                            placeholder="https://linkedin.com/in/username"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setEditingSocial(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSocialUpdate}>
                          Save Changes
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <stat.icon className="w-5 h-5 text-muted-foreground" />
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stat.title}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="achievements" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="achievements">
              <TrophyIcon className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
            <TabsTrigger value="activity">
              <ActivityIcon className="w-4 h-4 mr-2" />
              Recent Submissions
            </TabsTrigger>
            <TabsTrigger value="saved">
              <BookmarkIcon className="w-4 h-4 mr-2" />
              Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="mt-6">
            {owner.achievements.length === 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <TrophyIcon className="w-12 h-12 mx-auto mb-4" />
                    <p>No Acheivements yet</p>
                  </div>
                </CardContent>
              </Card>
            )}
            {owner?.achievements?.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <>
                      {owner.achievements.map((achievement, index) => (
                        <motion.div
                          key={achievement.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ duration: 0.5, delay: 0.1 * index }}
                        >
                          <Card>
                            <CardContent className="p-4 flex items-center gap-4">
                              <div className="text-2xl">{achievement.icon}</div>
                              <div>
                                <h3 className="font-semibold">
                                  {achievement.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Earned on{" "}
                                  {new Date(
                                    achievement.date
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            {recentSubmissions?.length === 0 ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-muted-foreground">
                    <ActivityIcon className="w-12 h-12 mx-auto mb-4" />
                    <p>No Submissions yet</p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {submissions.map((submission, index) => (
                      <motion.div
                        key={submission.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className="flex items-center gap-4"
                      >
                        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                          <div className="flex items-center gap-2">
                            {submission.status ? (
                              <CheckCircleIcon className="h-5 w-5 text-green-500" />
                            ) : (
                              <AlertCircleIcon className="h-5 w-5 text-red-500" />
                            )}
                            <span
                              className={
                                submission.status
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {submission.status ? "Accepted" : "Wrong Answer"}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <BookmarkIcon className="w-12 h-12 mx-auto mb-4" />
                  <p>No saved items yet</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </SectionWrapper>
  );
};

export default ProfilePage;
