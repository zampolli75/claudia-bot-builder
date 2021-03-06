'use strict';

const isUrl = require('../is-url');

class ViberMessage {
  constructor() {
    this.template = {};
  }

  addReplyKeyboard(isDefaultHeight, backgroundColor) {

    const replyKeyboard = {
      Type: 'keyboard',
      DefaultHeight: isDefaultHeight || true,
      BgColor: backgroundColor || '#FFFFFF',
      Buttons: []
    };

    this.template.keyboard = replyKeyboard;

    return this;
  }

  /**
   *
   * @param buttonObj - Object containing all of the possible attributes:
   * {
   *    text: String, HTML value of text with attributes
   *    actionType: String,
   *    actionBody: String,
   *    columnSize: Number, number value 1-6
   *    rowSize: Number, number value 1-2
   *    backgroundColor: String, hexadecimal value with Hash
   *    image: String - URL
   * }
   * @returns {ViberMessage}
   */
  addKeyboardButton(text, buttonValue, columnSize, rowSize, buttonObj) {

    if (!this.template.keyboard || !Array.isArray(this.template.keyboard.Buttons))
      throw new Error('KeyboardButton can only be added if you previously added the ReplyKeyboard');

    if (!text || typeof text !== 'string')
      throw new Error('Text is required for the Viber KeyboardButton template');

    if (!buttonValue || typeof buttonValue !== 'string')
      throw new Error('buttonValue is required for the Viber KeyboardButton template, and it can be a valid URL or a string');

    buttonObj = buttonObj || {};

    buttonObj.Text = text;
    buttonObj.ActionBody = buttonValue;

    if (isUrl(buttonValue)) {
      buttonObj.ActionType = 'open-url';
    } else {
      buttonObj.ActionType = 'reply';
    }

    if (columnSize && typeof columnSize == 'number' && columnSize > 0 && columnSize <= 6)
      buttonObj.Columns = columnSize;

    if (rowSize && typeof rowSize === 'number' && rowSize > 0 && rowSize <= 2)
      buttonObj.Rows = rowSize;

    this.template.keyboard.Buttons.push(buttonObj);

    return this;
  }

  get() {
    return this.template;
  }
}

class Text extends ViberMessage {
  constructor(text) {
    super();
    if (!text || typeof text !== 'string')
      throw new Error('Text is required for the Viber Text template');

    this.template = {
      type: 'text',
      text: text
    };
  }
}

class Photo extends ViberMessage {
  constructor(media, text) {
    super();
    if (!media || typeof media !== 'string')
      throw new Error('Photo needs to be an URL for the Viber Photo method');
    if (!text || typeof text !== 'string')
      throw new Error('Text needs to be an URL for the Viber Photo method');

    this.template = {
      type: 'picture',
      media: media,
      text: text
    };
  }
}

class Video extends ViberMessage {
  constructor(media, size, duration) {
    super();
    if (!media || typeof media !== 'string')
      throw new Error('Media needs to be an URL for Viber Video method');

    if (!size || typeof size !== 'number')
      throw new Error('Size needs to be a Number representing size in bytes for Viber Video method');

    this.template = {
      type: 'video',
      media: media,
      size: size
    };

    if (duration && typeof duration === 'number')
      this.template.duration = duration;
  }
}

class File extends ViberMessage {
  constructor(media, size, fileName) {
    super();
    if (!media || typeof media !== 'string')
      throw new Error('Media needs to be an URL for the Viber File method');

    if (!size || typeof size !== 'number')
      throw new Error('Size needs to be a Number representing size in bytes for the Viber File method');

    if (!fileName || typeof fileName !== 'string')
      throw new Error('File name needs to be a String representing the name of the file for the Viber File method');

    this.template = {
      type: 'file',
      media: media,
      size: size,
      file_name: fileName
    };
  }
}

class Contact extends ViberMessage {
  constructor(name, phone_number) {
    super();
    if (!name || !phone_number || typeof name !== 'string' || typeof phone_number !== 'string')
      throw new Error('Contact name and phone number are required for the Viber Contact template');

    this.template = {
      type: 'contact',
      contact: {
        name: name,
        phone_number: phone_number
      }
    };
  }
}


class Location extends ViberMessage {
  constructor(latitude, longitude) {
    super();
    if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number')
      throw new Error('Latitude and longitude are required for the Viber Location template');

    this.template = {
      type: 'location',
      location: {
        lat: latitude,
        lon: longitude
      }
    };
  }
}

class Url extends ViberMessage {
  constructor(media) {
    super();
    if (!media || typeof media !== 'string')
      throw new Error('Media needs to be an URL for the Viber URL method');

    if (media.length > 2000)
      throw new Error('Media URL can not be longer than 2000 characters for the Viber URL method');

    this.template = {
      type: 'url',
      media: media
    };
  }
}

module.exports = {
  Text: Text,
  Photo: Photo,
  Video: Video,
  File: File,
  Contact: Contact,
  Location: Location,
  Url: Url
};
