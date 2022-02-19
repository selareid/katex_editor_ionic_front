import { useEffect, useState } from "react";

interface syncStatus {
    inSync: boolean,
    syncText: string,
}

const useSyncManager = () => {
    const [localSyncCounter, setLocalSyncCounter] = useState(0); // what we've sent
    const [serverSyncedCount, setServerSyncCount] = useState(0); // what the server has confirmed
    const [syncStatus, setSyncStatus] = useState<syncStatus>();

    useEffect(() => { // update sync status
        if (localSyncCounter === 0) setSyncStatus(undefined);
        else if (localSyncCounter === serverSyncedCount) setSyncStatus({inSync: true, syncText: "Synced with Server"});
        else setSyncStatus({inSync: false, syncText: `Out of Sync | ${serverSyncedCount} vs ${localSyncCounter}`});
    }, [localSyncCounter, serverSyncedCount]);

    const incrementLocalSync = () => {
        setLocalSyncCounter(n => n+1);
    }

    const resetSyncStatus = () => {
        setServerSyncCount(0);
        setLocalSyncCounter(0);
    }

    return {
        localSyncCounter,
        incrementLocalSync,
        serverSyncedCount,
        setServerSyncCount,
        syncStatus,
        resetSyncStatus
    };
};

export default useSyncManager;