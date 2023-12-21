import React, { useState } from "react";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

const EmojiPicker = ({ onSelect }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleEmojiSelect = (emoji) => {
    onSelect(emoji.native);
    setShowPicker(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type your message..."
        onClick={() => setShowPicker(!showPicker)}
      />
      {showPicker && <Picker onSelect={handleEmojiSelect} />}
    </div>
  );
};

export default EmojiPicker;
