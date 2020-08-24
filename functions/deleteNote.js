const { findAndDecryptNotes } = require('./getNotes');

exports.deleteNote = async (event, context, callback, Note) => {
  const noteId =
    event.multiValueQueryStringParameters._id &&
    event.multiValueQueryStringParameters._id[0];

  if (noteId) {
    const note = await Note.findById(noteId);

    if (!noteId.match(/^[0-9a-fA-F]{24}$/) || !note) {
      callback(null, {
        statusCode: 400,
        body: 'Invalid request!',
      });
    } else {
      await note.remove();

      callback(null, {
        statusCode: 200,
        body: JSON.stringify(await findAndDecryptNotes(Note)),
      });
    }
  } else {
    callback(null, {
      statusCode: 400,
      body: 'Parameter id is missing!',
    });
  }
};