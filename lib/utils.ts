import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { RemoveUrlQueryParams, UrlQueryParams } from "./actions/shared.types";
import qs from "query-string";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const getTimestamp = (createdAt: Date): string => {
    const now = new Date();
    const diff = now.getTime() - createdAt.getTime();

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (years > 0) {
        return `${years} ${years === 1 ? "Year" : "Years"} Ago`;
    } else if (months > 0) {
        return `${months} ${months === 1 ? "Month" : "Months"} Ago`;
    } else if (days > 0) {
        return `${days} ${days === 1 ? "Day" : "Days"} Ago`;
    } else if (hours > 0) {
        return `${hours} ${hours === 1 ? "Hour" : "Hours"} Ago`;
    } else if (minutes > 0) {
        return `${minutes} ${minutes === 1 ? "Minute" : "Minutes"} Ago`;
    } else {
        return `${seconds} ${seconds === 1 ? "Second" : "Seconds"} Ago`;
    }
};

export const formatNumber = (num: number): string => {
    const absNum = Math.abs(num);

    if (absNum >= 1000000000) {
        return (num / 1000000000).toFixed(1) + "B";
    } else if (absNum >= 1000000) {
        return (num / 1000000).toFixed(1) + "M";
    } else if (absNum >= 1000) {
        return (num / 1000).toFixed(1) + "K";
    } else {
        return num.toString();
    }
};

export const getMonthYear = (date: Date): string => {
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${month} ${year}`;
};

export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
    const currentUrl = qs.parse(params);

    currentUrl[key] = value;

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: currentUrl,
        },
        { skipNull: true },
    );
};

export const removeKeysFromQuery = ({ params, keys }: RemoveUrlQueryParams) => {
    const currentUrl = qs.parse(params);

    keys.forEach((key) => delete currentUrl[key]);

    return qs.stringifyUrl(
        {
            url: window.location.pathname,
            query: currentUrl,
        },
        { skipNull: true },
    );
};
