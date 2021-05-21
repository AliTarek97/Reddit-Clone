import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const [{ data, fetching }] = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        // if it's not loading and there no me value
        if (!fetching && !data?.me) {
            router.replace('/login');
        }
    }, [fetching, data, router]);
}