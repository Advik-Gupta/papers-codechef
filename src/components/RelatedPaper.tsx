"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { type IPaper, type Filters } from "@/interface";
import Card from "@/components/Card";
import Loader from "@/components/ui/loader";

const RelatedPapers = () => {
    const params = useParams();
    const id = params?.id as string;

    const [currentPaper, setCurrentPaper] = useState<IPaper | null>(null);
    const [relatedPapers, setRelatedPapers] = useState<IPaper[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getpaper = await axios.get<IPaper>(`/api/paper-by-id/${id}`);
                const paper = getpaper.data;
                setCurrentPaper(paper);

                const allPapersBySubject = await axios.get<Filters>("/api/papers", {
                    params: { subject: paper.subject },
                });

                const all = allPapersBySubject.data.papers;

                const sameExam = all.filter(
                    (p) => p._id !== paper._id && p.exam === paper.exam
                ).slice(0, 4);

                let finalPapers = [...sameExam];

                if (finalPapers.length < 4) {
                    const additional = all.filter(
                        (p) =>
                            p._id !== paper._id &&
                            p.exam !== paper.exam &&
                            !finalPapers.some((fp) => fp._id === p._id)
                    );

                    finalPapers = [...finalPapers, ...additional.slice(0, 4 - finalPapers.length)];
                }

                setRelatedPapers(finalPapers);
            } catch (err) {
                console.error("Error fetching related papers:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            void fetchData();
        }
    }, [id]);


    if (loading) return <Loader />;
    if (!currentPaper) return <div className="vipna">Paper not found.</div>;

    return (
        <div className="p-6 space-y-4 vipna">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl play font-semibold my-6">Explore More</h2>
                <Link
                    href={`/catalogue?subject=${encodeURIComponent(currentPaper.subject)}`}
                    passHref
                >
                    <button className="border dark:border-[#7480FF] dark:bg-[#171720] border-[#734DFF] bg-[#ffffff] hover:dark:bg-[#21212d] p-3 play rounded-sm text-xl">
                        View All
                    </button>
                </Link>

            </div>
            {relatedPapers.length === 0 ? (
                <p className="play">No related papers found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedPapers.map((paper) => (
                        <Card
                            key={paper._id}
                            paper={paper}
                            onSelect={() => { "" }}
                            isSelected={false}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RelatedPapers;
