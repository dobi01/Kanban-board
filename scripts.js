"use strict";
$(function() {

  function randomString() {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ',
        str = '';
    for (var i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }

  function Column(name) {
    var self = this;

    this.id = randomString();
    this.name = name;
    this.$element = createColumn();

    function createColumn() {
      // CREATE COMPONENTS OF COLUMNS
      var $column = $('<div>').addClass('column'),
          $columnTitle = $('<h2>').addClass('column-title').text(self.name),
          $columnCardList = $('<ul>').addClass('column-card-list'),
          $columnDelete = $('<button>').addClass('btn-delete').text('x'),
          $columnAddCard = $('<button>').addClass('add-card').text('Add a card');

      // ADD EVENTS
      $columnDelete.click(function() {
        self.removeColumn();
      });

      $columnAddCard.click(function() {
        alertify.prompt('New task :-)', 'Enter the name of the card', 'Task'
          , function(evt, cardValue) {
              self.addCard(new Card(cardValue));
              alertify.success('You entered: ' + cardValue); 
            }
          , function() {
              alertify.error('Cancel');
            });
      });

      // CONSTRUCT COLUMN ELEMENT
      $column.append($columnTitle)
             .append($columnDelete)
             .append($columnAddCard)
             .append($columnCardList);

      // RETURN OF CREATED COLUMN
      return $column;
    }
  }

  Column.prototype = {
    addCard: function(card) {
      this.$element.children('ul').append(card.$element);
    },
    removeColumn: function() {
      this.$element.remove();
    }
  };


  function Card(description) {
  	var self = this;

    this.id = randomString();
    this.description = description;
    this.$element = createCard();

    function createCard() {
      // CREATE THE BLOCKS
      var $card = $('<li>').addClass('card'),
          $cardDescription = $('<p>').addClass('card-description').text(self.description),
          $cardDelete = $('<button>').addClass('btn-delete').text('x');

      // BIND TO CLICK EVENT
      $cardDelete.click(function() {
        self.removeCard();
      });

      // CONSTRUCT CARD ELEMENT
      $card.append($cardDelete)
           .append($cardDescription);

      // RETURN OF CREATED CARD
      return $card;
    }
  }

  Card.prototype = {
  	removeCard: function() {
  		this.$element.remove();
    }
  }

  function initSortable() {
    $('.column-card-list').sortable({
      connectWith: '.column-card-list',
      placeholder: 'card-placeholder',
      dropOnEmpty: true})
    .disableSelection();
   }

  var board = {
    name: 'Kanban Board',
    $element: $('#board .column-container'),
    addColumn: function(column) {
      this.$element.append(column.$element);
      initSortable();
    }
  };

  $('.create-column').click(function() {
    alertify.prompt('New column :-)', 'Enter the name of the column', 'Column'
    , function(evt, value) {
        var column = new Column(value);
        board.addColumn(column);
        alertify.success('You entered: ' + value); 
      }
    , function() { 
        alertify.error('Cancel'); 
      })
  });

  // CREATE COLUMNS
  var todoColumn = new Column('To do'),
      doingColumn = new Column('Doing'),
      doneColumn = new Column('Done');

  // ADD COLUMNS TO THE BOARD
  board.addColumn(todoColumn);
  board.addColumn(doingColumn);
  board.addColumn(doneColumn);

  // CREATE CARDS
  var card1 = new Card('New task'),
      card2 = new Card('Wow!');

  // ADD CARDS TO COLUMNS
  todoColumn.addCard(card1);
  doneColumn.addCard(card2);
})
