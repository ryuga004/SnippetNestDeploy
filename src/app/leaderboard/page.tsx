import React from 'react'

const Leaderboard = () => {
    return (
        <div>Still developing....</div>
    )
}

export default Leaderboard


// "use client";

// import { AnimatePresence, motion } from 'framer-motion';
// import {
//     ChevronLeft, ChevronRight,
//     Clock,
//     Filter,
//     Linkedin,
//     Moon,
//     Search,
//     Sun,
//     Target,
//     Trophy,
//     Twitter
// } from 'lucide-react';
// import Image from 'next/image';
// import React, { useState } from 'react';
// import ReactCountryFlag from 'react-country-flag';

// // Mock data - Replace with API calls
// const users = [
//     {
//         id: 1,
//         rank: 1,
//         username: "CodeMaster",
//         avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
//         country: "US",
//         problemsSolved: 342,
//         accuracy: 98.5,
//         fastestSubmission: "0.12s",
//         badges: ["100+ Problems", "Speed Demon", "Accuracy King"],
//         rankChange: 1,
//         languages: ["Python", "JavaScript", "C++"]
//     },
//     {
//         id: 2,
//         rank: 2,
//         username: "AlgoQueen",
//         avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
//         country: "IN",
//         problemsSolved: 315,
//         accuracy: 97.8,
//         fastestSubmission: "0.15s",
//         badges: ["100+ Problems", "Top Contributor"],
//         rankChange: -1,
//         languages: ["Java", "Python"]
//     },
//     {
//         id: 3,
//         rank: 3,
//         username: "ByteWarrior",
//         avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
//         country: "UK",
//         problemsSolved: 298,
//         accuracy: 96.4,
//         fastestSubmission: "0.18s",
//         badges: ["50+ Problems"],
//         rankChange: 1,
//         languages: ["JavaScript", "TypeScript"]
//     },
// ];

// const timeFilters = ["Weekly", "Monthly", "All Time"];
// const languageFilters = ["All", "Python", "JavaScript", "Java", "C++", "TypeScript"];

// interface LeaderboardProps {
//     isDarkMode: boolean;
//     setIsDarkMode: (value: boolean) => void;
// }

// const Leaderboard: React.FC<LeaderboardProps> = ({ isDarkMode, setIsDarkMode }) => {
//     const [selectedTime, setSelectedTime] = useState("All Time");
//     const [selectedLanguage, setSelectedLanguage] = useState("All");
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     console.log(currentPage);
//     // const [showShareModal, setShowShareModal] = useState<number | null>(null);

//     const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
//     const bgColor = isDarkMode ? 'bg-gray-800' : 'bg-white';
//     const borderColor = isDarkMode ? 'border-gray-700' : 'border-gray-200';

//     const filteredUsers = users.filter(user =>
//         user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
//         (selectedLanguage === "All" || user.languages.includes(selectedLanguage))
//     );

//     const Badge = ({ text }: { text: string }) => (
//         <span className={`px-2 py-1 rounded-full text-xs ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
//             }`}>
//             {text}
//         </span>
//     );

//     const ShareModal = ({ userId }: { userId: number }) => {
//         const user = users.find(u => u.id === userId);
//         if (!user) return null;

//         return (
//             <motion.div
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 className={`absolute right-0 top-0 mt-8 p-4 rounded-lg shadow-lg ${bgColor} ${borderColor} border z-50`}
//             >
//                 <h4 className={`${textColor} font-semibold mb-3`}>Share Profile</h4>
//                 <div className="flex gap-2">
//                     <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700">
//                         <Linkedin size={18} />
//                     </button>
//                     <button className="p-2 rounded-full bg-blue-400 text-white hover:bg-blue-500">
//                         <Twitter size={18} />
//                     </button>
//                 </div>
//             </motion.div>
//         );
//     };

//     return (
//         <div className="container mx-auto px-4 py-8">
//             {/* Header */}
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className={`text-3xl font-bold ${textColor}`}>Global Leaderboard</h1>
//                 <button
//                     onClick={() => setIsDarkMode(!isDarkMode)}
//                     className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
//                 >
//                     {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
//                 </button>
//             </div>

//             {/* Filters */}
//             <div className="flex flex-wrap gap-4 mb-6">
//                 <div className={`flex items-center px-4 py-2 rounded-lg ${bgColor} ${borderColor} border`}>
//                     <Search size={20} className={textColor} />
//                     <input
//                         type="text"
//                         placeholder="Search users..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className={`ml-2 bg-transparent outline-none ${textColor}`}
//                     />
//                 </div>

//                 <div className="flex gap-2">
//                     {timeFilters.map(filter => (
//                         <button
//                             key={filter}
//                             onClick={() => setSelectedTime(filter)}
//                             className={`px-4 py-2 rounded-lg transition-colors ${selectedTime === filter
//                                 ? 'bg-blue-600 text-white'
//                                 : `${bgColor} ${textColor} hover:bg-gray-100 dark:hover:bg-gray-700`
//                                 }`}
//                         >
//                             {filter}
//                         </button>
//                     ))}
//                 </div>

//                 <div className="relative group">
//                     <button className={`px-4 py-2 rounded-lg ${bgColor} ${borderColor} border flex items-center gap-2`}>
//                         <Filter size={20} className={textColor} />
//                         <span className={textColor}>Languages</span>
//                     </button>
//                     <div className={`absolute top-full left-0 mt-2 p-2 rounded-lg shadow-lg ${bgColor} border ${borderColor} hidden group-hover:block z-10`}>
//                         {languageFilters.map(lang => (
//                             <button
//                                 key={lang}
//                                 onClick={() => setSelectedLanguage(lang)}
//                                 className={`block w-full text-left px-4 py-2 rounded ${selectedLanguage === lang
//                                     ? 'bg-blue-600 text-white'
//                                     : `${textColor} hover:bg-gray-100 dark:hover:bg-gray-700`
//                                     }`}
//                             >
//                                 {lang}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* Leaderboard Table */}
//             <div className={`rounded-lg ${bgColor} ${borderColor} border overflow-hidden`}>
//                 <table className="w-full">
//                     <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'} border-b ${borderColor}`}>
//                         <tr>
//                             <th className={`px-6 py-4 text-left ${textColor}`}>Rank</th>
//                             <th className={`px-6 py-4 text-left ${textColor}`}>User</th>
//                             <th className={`px-6 py-4 text-left ${textColor}`}>
//                                 <Trophy size={20} className="inline mr-2" />
//                                 Problems
//                             </th>
//                             <th className={`px-6 py-4 text-left ${textColor}`}>
//                                 <Target size={20} className="inline mr-2" />
//                                 Accuracy
//                             </th>
//                             <th className={`px-6 py-4 text-left ${textColor}`}>
//                                 <Clock size={20} className="inline mr-2" />
//                                 Fastest
//                             </th>
//                             <th className={`px-6 py-4 text-left ${textColor}`}>Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         <AnimatePresence>
//                             {filteredUsers.map((user) => (
//                                 <motion.tr
//                                     key={user.id}
//                                     initial={{ opacity: 0, y: 20 }}
//                                     animate={{ opacity: 1, y: 0 }}
//                                     exit={{ opacity: 0, y: -20 }}
//                                     className={`border-b ${borderColor} hover:${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
//                                 >
//                                     <td className={`px-6 py-4 ${textColor}`}>
//                                         <div className="flex items-center">
//                                             {user.rank}
//                                             <span className={`ml-2 ${user.rankChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
//                                                 {user.rankChange > 0 ? '↑' : '↓'}
//                                             </span>
//                                         </div>
//                                     </td>
//                                     <td className={`px-6 py-4 ${textColor}`}>
//                                         <div className="flex items-center gap-3">
//                                             <Image
//                                                 src={user.avatar}
//                                                 alt={user.username}
//                                                 className="w-10 h-10 rounded-full"
//                                             />
//                                             <div>
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="font-semibold">{user.username}</span>
//                                                     <ReactCountryFlag
//                                                         countryCode={user.country}
//                                                         svg
//                                                         style={{
//                                                             width: '1.2em',
//                                                             height: '1.2em',
//                                                         }}
//                                                     />
//                                                 </div>
//                                                 <div className="flex gap-1 mt-1">
//                                                     {user.badges.map((badge, idx) => (
//                                                         <Badge key={idx} text={badge} />
//                                                     ))}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className={`px-6 py-4 ${textColor}`}>{user.problemsSolved}</td>
//                                     <td className={`px-6 py-4 ${textColor}`}>{user.accuracy}%</td>
//                                     <td className={`px-6 py-4 ${textColor}`}>{user.fastestSubmission}</td>
//                                     <td className="px-6 py-4">
//                                         <div className="relative">
//                                             {/* <button
//                                                 onClick={() => setShowShareModal(showShareModal === user.id ? null : user.id)}
//                                                 className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
//                                             >
//                                                 <Share2 size={20} className={textColor} />
//                                             </button> */}
//                                             {showShareModal === user.id && <ShareModal userId={user.id} />}
//                                         </div>
//                                     </td>
//                                 </motion.tr>
//                             ))}
//                         </AnimatePresence>
//                     </tbody>
//                 </table>
//             </div>

//             {/* Pagination */}
//             <div className="flex justify-center mt-6 gap-2">
//                 <button
//                     onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                     className={`p-2 rounded-lg ${bgColor} ${borderColor} border`}
//                 >
//                     <ChevronLeft size={20} className={textColor} />
//                 </button>
//                 <button
//                     onClick={() => setCurrentPage(p => p + 1)}
//                     className={`p-2 rounded-lg ${bgColor} ${borderColor} border`}
//                 >
//                     <ChevronRight size={20} className={textColor} />
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default Leaderboard;