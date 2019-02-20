'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
const $ = require('jquery');

const e = React.createElement;

function isLetter(c) {
  return c && c.toLowerCase() != c.toUpperCase();
}

function Square(props) {

	return (
		<input 
			type="text"
			className="square"
			onInput={props.onInput}
			onKeyPress={props.onKeyPress}
		/>
	);
}

class Row extends React.Component {

	renderSquare(i) {
		return <Square
			onKeyPress={this.onKeyPress}
			onInput={this.onInput}
		/>;
	}

	/*
	* On key press if not a letter stop propagation
	*/
	onKeyPress(e) {
		let code;
		if (e.keyCode) code = e.keyCode;
		else if (e.which) code = e.which;
		var character = String.fromCharCode(code);
		if(!isLetter(character)){
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}

	/*
	* Replace text by input and focus next square
	*/
	onInput(e) {
		let target = $(e.target);
		let data = e.nativeEvent.data;
		if(isLetter(data)){
			target.val(data.toUpperCase());
			target.next().focus();
		}
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