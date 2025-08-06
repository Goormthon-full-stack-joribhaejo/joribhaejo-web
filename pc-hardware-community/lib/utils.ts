import type { Comment } from "@/lib/types"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildCommentTree(flat: Comment[]): Comment[] {
  const map = new Map<number, Comment & { replies: Comment[] }>()
  const roots: (Comment & { replies: Comment[] })[] = []
  for (const c of flat) {
    (c as any).replies = []
    map.set(c.id, c as Comment & { replies: Comment[] })
  }
  for (const c of map.values()) {
    if (c.parentId === null) {
      roots.push(c)
    } else {
      const parent = map.get(c.parentId)
      parent?.replies.push(c)
    }
  }
  return roots
}

export function getTotalCommentsCount(comments: Comment[]): number {
  let count = 0;
  function countRecursive(list: Comment[]) {
    for (const c of list) {
      count++;
      if ((c as any).replies && Array.isArray((c as any).replies)) {
        countRecursive((c as any).replies);
      }
    }
  }
  countRecursive(comments);
  return count;
}

export function getTimeAgo(dateStr: string) {
  const now = new Date()
  const d = new Date(dateStr)
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (sec < 60) return '방금 전'
  if (sec < 3600) return `${Math.floor(sec / 60)}분 전`
  if (sec < 86400) return `${Math.floor(sec / 3600)}시간 전`
  return `${Math.floor(sec / 86400)}일 전`
}
