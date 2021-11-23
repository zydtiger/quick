import $ from 'jquery';

export interface Note {
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


    getTitle(noteContent: string): string {
        let title: string;
        let lineBreak = noteContent.indexOf('<div>');
        if (lineBreak != -1) title = noteContent.substring(0, lineBreak);
        else title = this.parseHTML(noteContent);
        title = title || 'New Note';
        return title;
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
    }
}