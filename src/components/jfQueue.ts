export class JfQueueItem {
    id: string;
    url: string;
    startPositionTicks: number;
    subtitleStreamIndex: number | undefined;
    audioStreamIndex: number | undefined;
    liveStreamId: string | undefined;
    mediaSourceId: string | undefined;
    //otherstuff: ?;
    constructor(id: string, url: string) {
        this.id = id;
        this.url = url;
        this.startPositionTicks = 0;
    }
}

export class JfQueue extends cast.framework.QueueBase {
    // Singleton stuff
    private static instance: JfQueue | null = null;
    static getInstance(): JfQueue {
        if (!this.instance) {
            this.instance = new JfQueue();
        }
        return this.instance;
    }

    private queueManager: cast.framework.QueueManager;
    private queueData: cast.framework.messages.QueueData;

    constructor() {
        super();
        this.queueManager = cast.framework.CastReceiverContext.getInstance()
            .getPlayerManager()
            .getQueueManager();
        this.queueData = new cast.framework.messages.QueueData();
        this.queueData.name = 'Jellyfin queue';
        this.queueData.description = 'Queue items from jellyfin here';
    }

    // Initialize the queue with requestData. This happens when LOAD is requested.
    initialize(requestData: cast.framework.messages.LoadRequestData) {
        console.log('JfQueue initialize');
        if (requestData.queueData) {
            this.queueData = requestData.queueData;
        } else {
            this.queueData.items = this.nextItems();
            this.queueData.startIndex = 0;
            this.queueData.startTime = 0;
        }
        return this.queueData;
    }

    // fetch items to play
    nextItems(): cast.framework.messages.QueueItem[] {
        console.log('JfQueue nextItems');
        return [];
    }

    enqueue(items: JfQueueItem[]) {
        console.log('JfQueue enqueue');
        // Translate items into queue compatible items
        const qitems: cast.framework.messages.QueueItem[] = [];
        for (const item of items) {
            const qitem = new cast.framework.messages.QueueItem();
            qitem.media = new cast.framework.messages.MediaInformation();
            qitem.media.contentId = item.id;
            qitem.media.contentUrl = item.url;
            qitems.push(qitem);
        }
        // without the index, this is an append operation
        this.queueManager.insertItems(qitems);
    }

    replace(items: JfQueueItem[]) {
        console.log('JfQueue not implemented: replace', items);
    }

    onCurrentItemIdsChanged(itemId: number) {
        console.log('Playing queue item no ' + itemId.toString());
    }
}
