import $ from 'jquery';
import cats from './cats';

$(function () {
    $('<h1>Cats Hot</h1>').appendTo('#testId');
    const ul = $('<ul></ul>').appendTo('#testId');
    for (const cat of cats) {
        $('<li></li>').text(cat).appendTo(ul);
    }
})
