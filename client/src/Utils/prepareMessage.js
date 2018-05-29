export default (messages) => {
  if (!messages) return [];

  return messages.map(({
    id: _id, text, createdAt, from,
  }) => ({
    _id,
    text,
    createdAt,
    user: {
      _id: from.id,
      name: from.username,
      avatar: 'https://placeimg.com/140/140/any',
    },
  }));
};
