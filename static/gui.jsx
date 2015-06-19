"use babel";
import React from 'react';
let CommentBox = React.createClass({
  render: function() {
    return (
      <div className="CommentBox">
      fuck off
      </div>
    );
  }
});

React.render(
  <CommentBox />,
  document.getElementById('content')
);
