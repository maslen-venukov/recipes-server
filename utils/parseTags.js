const parseTags = tags => tags === '' ? null : tags.split(',').map(tag => tag.trim());

export default parseTags;