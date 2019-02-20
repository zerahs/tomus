'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
const $ = require('jquery');

const e = React.createElement;

function isLetter(c) {
 	return c && c.toLowerCase() != c.toUpperCase();
 	// return c.length === 1 && c.match(/[a-z]/i);
}

function Square(props) {

	return (
		<input 
			type="text"
			className="square"
			onInput={props.onInput}
			onKeyDown={props.onKeyDown}
		/>
	);
}

class Row extends React.Component {

	renderSquare(i) {
		return <Square
			onKeyDown={this.onKeyDown}
			onInput={this.onInput}
		/>;
	}

	onKeyDown(e) {
		let code;
		if (e.keyCode)
			code = e.keyCode;
		else if (e.which)
			code = e.which;

		var character = String.fromCharCode(code);
		if(isLetter(character))
			return true;
		
		console.log(code);
		// Backspace or left arrow
		if(code==8 || code==37){
			let target = $(e.target);
			target.prev().focus();
		}
		// Right arrow
		if(code==39){
			let target = $(e.target);
			target.next().focus();
		}
		// Enter
		if(code==13){
			// TODO submit word
			// This will have to be done in another class (board or game ?)
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	/*
	* Replace text by input and focus next square
	*/
	onInput(e) {
		console.log('input');
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
