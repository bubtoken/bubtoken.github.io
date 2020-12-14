function copyLinkToClipboard() {
    $('.ref-link')[0].select()
    document.execCommand("copy")
    clearSelection()
}

function clearSelection() {
    if (window.getSelection) {
        window.getSelection().removeAllRanges()
    } else if (document.selection) {
        document.selection.empty()
    }
}