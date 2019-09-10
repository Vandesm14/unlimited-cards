var players = [];
var currentPlayer = 0;
var cards = {
	numbers: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
	colors: ['red', 'green', 'blue', 'yellow'],
	suits: []
};
var piles = [{
		name: 'draw',
		type: 'draw',
		forceFaceDown: true,
		limitedLoopback: false, // false or name of loopback entry pile
		dragOut: false
	},
	{
		name: 'discard',
		type: 'discard',
		forceFaceDown: false,
		limitedLoopback: false,
		dragOut: true
	}
];

var game = {
	owner: '',
	options: {

	}
};

$(document).ready(function () {
	createSortable($('.player-hand')[0]);
	createPiles();
	generateCard();

	$('.pile').each(function (i, el) {
		if (piles.find(obj => obj.name === $(this).data('name') && obj.dragOut === false)) {
			createSortable($(this)[0], false, true, false);
		} else {
			createSortable($(this)[0], false, true, true);
		}
		console.log($(this).data('name'));
		console.log(piles[i].dragOut);
	});

	$('#nextPlayer').on('click', function () {
		let current = currentPlayer;
		if (players[current] === undefined || players.length === 0) {
			players.push({
				name: prompt('Your Name:')
			});
		}
		players[current].cards = [];
		$('.player-hand').children('.card').each(function (i, el) {
			players[current].cards.push({
				number: $(el).children('.card-number').text(),
				color: $(el).attr('class').match(new RegExp('(' + cards.colors.join('|') + ')'))[0],
				suit: $(el).data('suit')
			})
		});
	});
});

function createPiles() {
	for (let i in piles) {
		let template = $('#pileTemplate').html();
		template = template.replace('{{type}}', piles[i].type);
		template = template.replace('{{name}}', piles[i].name);
		template = template.replace('{{name}}', piles[i].name);
		if (piles[i].type.match(/(draw|discard|stack)/g) !== null) {
			template = template.replace('{{mainType}}', piles[i].type);
		}
		$('.gameArea').append(template);
	}
}

function createSortable(el, sort = true, invert = false, put = true) {
	Sortable.create(el, {
		group: 'pile',
		animation: 150,
		ghostClass: "sort-placeholder",
		chosenClass: "sort-chosen",
		dragClass: "sort-drag",
		sort: sort,
		invertSwap: invert,
		put: put,
		onStart: function () {
			$('.pile:not(.draw)').addClass('open');
		},
		onEnd: function () {
			$('.pile:not(.draw)').removeClass('open');
			checkPile();

			$('.player-hand').find('.card[data-facedown="true"]').attr('data-facedown', 'false');
		}
	});
}

function checkPile() {
	if ($('.pile.draw').children().length === 0) {
		generateCard();
	}
}

generateCard();

function generateCard() {
	let rand = {
		number: cards.numbers[Math.floor(Math.random() * cards.numbers.length)],
		color: cards.colors[Math.floor(Math.random() * cards.colors.length)],
		suit: cards.suits[Math.floor(Math.random() * cards.suits.length)],
	};
	let template = $('#cardTemplate').html();
	template = template.replace('{{number}}', rand.number);
	template = template.replace('{{color}}', rand.color);
	template = template.replace('{{suit}}', rand.suit);

	if (piles.find(obj => obj.name === 'draw').forceFaceDown) {
		template = template.replace('{{faceDown}}', 'true');
		$('.pile.draw').append(template);
	} else {
		template = template.replace('{{faceDown}}', 'false');
		$('.pile.draw').append(template);
	}

}

function randID() {
	return '_' + Math.random().toString(36).substr(2, 6);
};