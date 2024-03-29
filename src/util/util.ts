import { format } from "date-fns";
import sha256 from 'crypto-js/sha256';

export function getTimeAgo(date:any) {
    const currentDate = new Date();
    const blogDate = new Date(date);
    const timeDifferenceInMilliseconds = currentDate.getTime() - blogDate.getTime();
    const timeDifferenceInMinutes = Math.floor(timeDifferenceInMilliseconds / (60 * 1000));
    
    if (timeDifferenceInMinutes < 1) {
      return `now`;
    } else if (timeDifferenceInMinutes < 60) {
      return `${timeDifferenceInMinutes} minutes ago`;
    } else if (timeDifferenceInMinutes < 1440) {
      const hours = Math.floor(timeDifferenceInMinutes / 60);
      return `${hours} hours ago`;
    } else if (timeDifferenceInMinutes < 43200) {
      const days = Math.floor(timeDifferenceInMinutes / 1440);
      return `${days} days ago`;
    } else if (timeDifferenceInMinutes < 525600) {
      const months = Math.floor(timeDifferenceInMinutes / 43200);
      return `${months} months ago`;
    } else {
      const years = Math.floor(timeDifferenceInMinutes / 525600);
      return `${years} years ago`;
    }
  }

  export const formattedCreatedAt = (date: string) =>
   format(new Date(date), 'MMMM d, yyyy');

  export function formatBlogName(name:string) {
    return name
      .replace(/[|&#()/:?–—]/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/hackthebox/gi, 'htb')
      .toLowerCase();
  }

export function getAuthorizationHeader(): string {
  const userJSON = localStorage.getItem("user");
  const userData = JSON.parse(userJSON!);
  const usertToken = userData.token

  return usertToken
}

export function generateUniqueKey(email: string) {
  return sha256(email).toString();
}