'use strict';
import React from 'react';
import ReactDOM from 'react-dom';

const e = React.createElement;

class Square extends React.Component {

	render() {
		return (
			<div className="square">
			</div>
		);
	}
}

class Row extends React.Component {

	renderSquare(i) {
		return <Square />;
	}

	render() {
		return (
			<div className="board-row">
				{this.renderSquare()}
				{this.renderSquare()}
				{this.renderSquare()}
				{this.renderSquare()}
				{this.renderSquare()}
				{this.renderSquare()}
			</div>
		);
	}
}

class Board extends React.Component {

	renderRow(i) {
		return <Row />;
	}

	render() {

		return (
			<div className="board">
				{this.renderRow()}
				{this.renderRow()}
				{this.renderRow()}
				{this.renderRow()}
			</div>
		);
	}

}

const domContainer = document.querySelector('#board-container');
ReactDOM.render(e(Board), domContainer);
console.log('fdf');