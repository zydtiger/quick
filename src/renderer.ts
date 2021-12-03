/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import '../lib/bootstrap-3.4.1-dist/css/bootstrap.min.css';
import '../lib/font-awesome-4.7.0/css/font-awesome.min.css';
import './index.less';
import './content.less';
import './menu.less';
import './scheme.less'
import $ from 'jquery';
import Vue from 'vue';
import { ipcRenderer, Menu, MenuItem, MenuItemConstructorOptions } from 'electron';
import lib, { Note } from './lib';

function removeIndex(arr: Array<Object>, index: number) {
    return arr.slice(0, index).concat(arr.slice(index + 1, arr.length));
}

(async () => {
    let notes: Array<Note> = await ipcRenderer.invoke('get-notes');

    lib.getTitles(notes);
    lib.getSummaries(notes);
    lib.getIds(notes);

    console.log('notes: ', notes);

    let noteBlock = new Vue({
        el: '#note-block',
        data: {
            menuCollapsed: false,
            contentCollapsed: false,
            curId: -1,
            notes: notes,
            chgCnt: 0,
            curContent: notes[0]?.content,
            searchToggled: false,
            searchTag: ''
        },
        watch: {
            chgCnt() {
                if (this.chgCnt == 10) this.save();
            },
            searchToggled() {
                if (!this.searchToggled) this.searchTag = '';
                else setTimeout(() => $('#search').trigger('focus'));
            }
        },
        methods: {
            save() {
                ipcRenderer.send('save-notes', this.notes);
                this.chgCnt = 0;
                $('title').text(this.notes[this.curId].title);
            },
            toggleNote() {
                if (this.contentCollapsed) {
                    $('#menu-wrapper').css('width', '230px');
                    $('#content').css('left', '230px');
                    ipcRenderer.send('restore-width');
                } else {
                    $('#menu-wrapper').css('width', '100%');
                    $('#content').css('left', '100%');
                    ipcRenderer.send('resize-width', 400);
                }

                this.contentCollapsed = !this.contentCollapsed;
            },
            addNote() {
                this.notes.unshift({
                    title: 'New Note',
                    content: '',
                    date: lib.newNoteDate(),
                });
                lib.getIds(this.notes);
                this.chgContent(0);
                this.save();
            },
            delNote() {
                ipcRenderer.invoke('message-box', {
                    type: 'question',
                    title: 'Confirm Deletion',
                    message: 'Are you sure?',
                    buttons: ['OK', 'Cancel'],
                }).then(res => {
                    if (res.response == 0) {
                        this.notes = removeIndex(this.notes, this.curId);
                        if (this.curId > 0)
                            this.chgContent(this.curId - 1);
                        else if (this.notes.length > 0)
                            this.chgContent(this.curId);
                        else this.curId = -1;
                        lib.getIds(this.notes);
                        this.save();
                    }
                })
            },
            chgContent(id: number) {
                if (id >= this.notes.length) return;

                this.curId = id;
                if (this.contentCollapsed) this.toggleNote();

                this.save();
                $('title').text(this.notes[this.curId].title);
                this.curContent = this.notes[this.curId].content;
            },
            toggleMenu() {
                if (this.menuCollapsed) {
                    $('#menu-wrapper').css('left', '0');
                    $('#content').css({
                        'left': '230px',
                        'width': 'calc(100vw - 230px)'
                    });
                } else {
                    $('#menu-wrapper').css('left', '-230px');
                    $('#content').css({
                        'left': '0',
                        'width': '100vw'
                    });
                }

                this.menuCollapsed = !this.menuCollapsed;

            },
            updateContent() {
                if (this.curId == -1) {
                    this.addNote();
                    this.chgContent(0);
                }
                let ncontent = $('.main').html();
                this.notes[this.curId].content = ncontent;
                this.notes[this.curId].title = lib.getTitle(ncontent);
                this.notes[this.curId].summary = lib.getSummary(ncontent);

                // this.curContent = this.notes[this.curId].content;

                $('title').text(this.notes[this.curId].title + ' ●');
                this.chgCnt++;
            },
            search() {
                this.searchTag = $('#search').val();
            },
        },
        computed: {
            filteredNotes() {
                let tmp = this.notes.filter((note: Note) => note.content.includes(this.searchTag));
                console.log(tmp);
                return tmp;
            }
        },
    })

    noteBlock.chgContent(0);

    ipcRenderer.on('save', noteBlock.save);
    ipcRenderer.on('new-note', noteBlock.addNote);
    ipcRenderer.on('closing', () => {
        if (noteBlock.chgCnt > 0) {
            ipcRenderer.invoke('message-box', {
                type: 'question',
                title: 'Save',
                message: 'Do you want to save unsaved changes?',
                buttons: ['Yes', 'No'],
            }).then(res => {
                if (res.response == 0)
                    noteBlock.save();
                ipcRenderer.send('close-window');
            })
        } else ipcRenderer.send('close-window');
    })
    ipcRenderer.on('bold', () => {
        document.execCommand('bold');   
    })
    ipcRenderer.on('italic', () => {
        document.execCommand('italic');
    })
    ipcRenderer.on('underline', () => {
        document.execCommand('underline');
    })
})();