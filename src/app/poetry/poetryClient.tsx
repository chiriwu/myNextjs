"use client";

import { post } from "@/lib/request"
import React, {useState, useEffect, useRef, useCallback } from "react"

type PoemItem = {
    id: number,
    name: string,
    description: string
}
type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};
export default function Poetry() {

    const [poets, setPoets] = useState<PoemItem[]>([])
    const [, setPage] = useState(0);
    const [hasNext, setHasNext] = useState(true);
    const [loading, setLoading] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef(false);

    const getPoems = useCallback(async (pageNum: number, append: boolean = false) => {
      if (loadingRef.current) return;   // 用 ref 立即挡住第二次
      loadingRef.current = true;         // 同步置为 true
      setLoading(true);
      try {
        const res = await post<PoemItem[] & { pagination?: Pagination }>(
          "/api/poetry/getPoemData",
          { page: pageNum, pageSize: 10 }
        );
        const list = Array.isArray(res.data) ? res.data : [];
        const pagination = (res as { pagination?: Pagination }).pagination;
  
        if (append) {
          setPoets((prev) => [...prev, ...list]);
        } else {
          setPoets(list);
        }
        setPage(pageNum); 
        setHasNext(pagination?.hasNext ?? false);
      } catch (err) {
        console.error("err=", err);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    }, []);

 // 滑到底部加载下一页
 useEffect(() => {
  const el = sentinelRef.current;
  if (!el) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (loadingRef.current) return;  // 可选：这里也挡一次
      if (!entry.isIntersecting) return;
      if(loading) return
      setPage((p) => {
        getPoems(p + 1, true);
        return p;
      });
    },
    { root: null, threshold: 0 }
  );
  observer.observe(el); 
  return () => observer.disconnect();
}, []); 

    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          {/* 标题 */}
          <h1 className="mb-8 text-2xl font-semibold text-foreground sm:text-3xl">
            诗人信息
          </h1>
  
          {/* 诗人列表卡片 */}
          <ul className="flex flex-col gap-4">
            {poets.map((poet) => (
              <li
                key={poet.id}
                className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="mb-2 font-bold text-foreground">{poet.name}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {poet.description}
                </p>
              </li>
            ))}
          </ul>
          {/* 底部哨兵：进入视口时加载下一页 */}
          {
          
            <div ref={sentinelRef} className="h-10 flex items-center justify-center">
              {loading && <span className="text-muted-foreground">加载中...</span>}
              {!hasNext && poets.length > 0 && (
                <span className="text-muted-foreground">没有更多了</span>
              )}
            </div>
          }
        </div>
      </div>
    )
  }