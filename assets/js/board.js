'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
const $ = require('jquery');

const e = React.createElement;

function isLetter(c) {
 	return c && c.toLowerCase() != c.toUpperCase();
 	// return c.length === 1 && c.match(/[a-z]/i);
}


// TODO
// Set all squares disabled except the one with focus ?
// Or set all squares disabled except current row
function Square(props) {

	return (
		<input 
			disabled={props.disabled}
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
			key={i}
			onKeyDown={this.props.onKeyDown}
			onInput={this.props.onInput}
			disabled={this.props.disabled}
		/>;
	}

	render() {
		let squares = [];
		for(let i=0;i<this.props.nbCols; i++){
			squares.push(this.renderSquare(i));
		}
		return (
			<div className="board-row">
				{squares}
			</div>
		);
	}
}

class Board extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			nbCols: 9,
			nbRows: 6,
			currentRow: 0,
		}


		// This binding is necessary to make 'this' work in the callback
		this.onKeyDown = this.onKeyDown.bind(this);
	}

	focusFirstAvailableInput() {
		let input = $(".board-row").eq(this.state.currentRow).find('input:enabled:first');
		input.focus();
	}

	componentDidUpdate(prevProps) {
		this.focusFirstAvailableInput();
	}
	componentDidMount(prevProps) {
		this.focusFirstAvailableInput();
	}

	renderRow(i) {
		return <Row
			nbCols={this.state.nbCols}
			key={i}
			onKeyDown={this.onKeyDown}
			onInput={this.onInput}
			disabled={i!=this.state.currentRow}
		/>;
	}

	onInput(e) {
		let target = $(e.target);
		let data = e.nativeEvent.data;
		if(isLetter(data)){
			target.val(data.toUpperCase());
			target.next().focus();
		}
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
		
		// Backspace or left arrow
		if(code==8 || code==37){
			let target = $(e.target);
			target.prev().focus();
		}
		// Right arrow
		else if(code==39){
			let target = $(e.target);
			target.next().focus();
		}
		// Enter
		else if(code==13){
			this.validateAndSubmit();
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	validateAndSubmit() {
		const newRow = this.state.currentRow + 1;
		if(newRow >= this.state.nbRows){
			//END GAME
		}
		this.setState({currentRow:newRow});
		let temp = $('input:enabled:first');
		temp.focus();
	}

	render() {
		let rows = [];
		for(let i=0; i<this.state.nbRows;i++){
			rows.push(this.renderRow(i));
		}
		return (
			<div className="board">
				{rows}
			</div>
		);
	}

}

const domContainer = document.querySelector('#board-container');
ReactDOM.render(e(Board), domContainer);
