import { useCallback,useState } from "react";

interface Papper {
    id: number;
    distance: number;
    arxiv_id: string;
    category: string;
    abstract: string;
}
export function usePappers() {
    const [pappers, setPappers] = useState<Papper[] | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchPappers = useCallback(async (prompt:string) => {
        setLoading(true);
        const response = await fetch("http://localhost:5000/pappers?prompt="+prompt);
        const data = await response.json();
        setPappers(data);
        setLoading(false);
    },[]);

    const invalidateData = useCallback(() => {
        setPappers(null);
    },[]);
    return { data: pappers, loading, fetchPappers, invalidateData };
}