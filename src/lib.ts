import $ from 'jquery';

export interface Note {
    id: number,
    title: string,
    content: string,
    date: string,
    summary: string,
}

export default {
    newNoteDate() {
        let date = new Date();
        return date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    },

    parseHTML(htmlsrc: string): string {
        let tmp = document.createElement('div');
        $(tmp).html(htmlsrc);
        return $(tmp).text();
    },

    insert(src: string, index: number, str: string): string {
        let res = src.substring(0,index) + str + src.substr(index);
        return res;
    },

    getTitle(noteContent: string): string {
        let title: string;
        let lineBreak = noteContent.indexOf('<div>');
        if (lineBreak != -1) title = noteContent.substring(0, lineBreak);
        else title = noteContent;
        title = this.parseHTML(title) || 'New Note';
        return title;
    },

    boldTitle(noteContent: string): string {
        let title = this.getTitle(noteContent);
        noteContent = this.insert(noteContent, title.length, '</b>');
        noteContent = '<b>' + noteContent;

        console.log(noteContent);

        return noteContent;
    },

    getTitles(notes: Array<Note>) {
        for (let note of notes)
            note.title = this.getTitle(note.content);
    },

    getSummary(noteContent: string): string {
        let summary: string;
        let lineBreak = noteContent.indexOf('<div>');
        if (lineBreak != -1) summary = noteContent.substr(lineBreak);
        else summary = noteContent;
        summary = this.parseHTML(summary) || 'Type Something';
        return summary;
    },

    getSummaries(notes: Array<Note>): void {
        for (let note of notes)
            note.summary = this.getSummary(note.content);
    },

    getIds(notes: Array<Note>): void {
        for (let i in notes)
            notes[i].id = parseInt(i);
    },

    getSelectionInfo() {
        console.log(window.getSelection())

        let selection = window.getSelection();

        let startNode = selection.anchorNode;
        let endNode = selection.focusNode;

        let startNodeOffset = selection.anchorOffset;
        let endNodeOffset = selection.focusOffset;

        while (startNode.nodeName == '#text') startNode = startNode.parentNode;
        while (endNode.nodeName == '#text') endNode = endNode.parentNode;

        let parent = document.querySelector('.main')
        console.log(parent.childNodes)
        let startNodePos, endNodePos;
        for (let i = 0; i < parent.childNodes.length; i++) {
            if (parent.childNodes[i] as Node == startNode) startNodePos = i;
            if (parent.childNodes[i] as Node == endNode) endNodePos = i;
            if (startNodePos && endNodePos) break;
        }
        if (startNodePos > endNodePos) {
            [startNodePos, endNodePos] = [endNodePos, startNodePos];
            [startNodeOffset, endNodeOffset] = [endNodeOffset, startNodeOffset];
        }
        
        if (startNodeOffset == $(startNode).text().length) startNodePos++, startNodeOffset = 0;
        while ($(parent.childNodes[startNodePos]).text().length == 0) startNodePos++, startNodeOffset = 0;
        console.log($(parent.childNodes[startNodePos]).text().length)
        while (endNodeOffset == 0) endNodeOffset = $(parent.childNodes[--endNodePos]).text().length;

        console.log(startNodePos, endNodePos, startNodeOffset, endNodeOffset);

        return {
            nodes: parent.childNodes,
            startPos: startNodePos,
            endPos: endNodePos
        };
    },

    shouldUpdateText(nodes: NodeListOf<ChildNode>, startPos: number, endPos: number, match: (node: Node) => boolean): boolean {
        for (let i = startPos; i <= endPos; i++) {
            if (match(nodes[i])) return true;
        }

        return false;
    }
}