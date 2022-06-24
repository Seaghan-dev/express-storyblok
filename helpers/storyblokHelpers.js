function removeEditableTags (story = {}) {
    // abort if no root editable tag is present
    if (!story.content?._editable) {
        return story
    }

    let rootEditableTag = story.content?._editable.slice()

    story.content._editable = rootEditableTag.replace(/^<!--/, '').replace(/-->$/, '')

    if (!Array.isArray(story.content.body) || story.content.body.length > 1) {
        return story
    }

    const newContentBody = []

    for (let blok of story.content.body) {
        if (!blok._editable) continue

        let currentEditableTag = blok._editable.slice()
        newContentBody.push({ ...blok, _editable: currentEditableTag.replace(/^<!--/, '').replace(/-->$/, '') })
    }

    story.content.body = newContentBody

    return story
}

module.exports = { removeEditableTags }