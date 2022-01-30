// TODO :　不要？
'use strict';
import $ from 'jquery';
globalThis.jQuery = $;
import bootstrap from 'bootstrap';


// const buttonMemoChange = $('#memo-change-button');
// buttonMemoChange.click(() => {
//   const bookmarkId = button.data('data-bookmark-id');
//   const userId = button.data('data-user-id');
//   const comment = prompt('コメントを255文字以内で入力してください。');
//   if(comment){
//     $.post(`/bookmarks/${bookmarkId}/users/${userId}/comments`,
//     { comment: comment },
//     (data) => {
//       $('memo-button').txt(data.comment);
//     });
//   }
// });