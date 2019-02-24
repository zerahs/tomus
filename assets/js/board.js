'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
const $ = require('jquery');

const e = React.createElement;

function isLetter(c) {
 	return c && c.toLowerCase() != c.toUpperCase();
 	// return c.length === 1 && c.match(/[a-z]/i);
}
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}


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

//@todo valid letters en rouge toujours affichées
class Board extends React.Component {

	constructor(props) {
		super(props);
		let nbCols = 9;
		let validLetters = new Array(nbCols).join(' ');

		this.state = {
			nbCols: nbCols,
			nbRows: 20,
			currentRow: 0,
			validLetters: validLetters,
			solution: null,
		}

		// This binding is necessary to make 'this' work in the callback
		this.onKeyDown = this.onKeyDown.bind(this);
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

	fillValidLetters(row) {
		let inputs = $(".board-row").eq(row).find('input');
		let validLetters = this.state.validLetters;
		inputs.each(function(i){
			$(this).val(validLetters.charAt(i).toUpperCase());
		});
	}
	componentDidUpdate(prevProps) {
		this.focusFirstAvailableInput();
	}
	componentDidMount(prevProps) {
		this.fetchWord();
	}

	fetchWord() {
		let data = {'nb_cols': this.state.nbCols};
		fetch('http://localhost:8000/board/word-fetch', {
			'method': 'POST',
			'body': JSON.stringify(data),
		})
		.then(res => res.json())
		.then(
			(result) => {
				if(result.error){
					console.log('result.error ', result.error);
					return;
				}
				console.log(result.word);
				let validLetters = this.state.validLetters;
				validLetters = validLetters.replaceAt(0, result.word.charAt(0));
				this.setState({'validLetters': validLetters});
				this.setState({'solution': result.word});
				this.fillValidLetters(0);

			},
			(error) => console.log('(error) ', error)
		)
		.catch(
			(error) => console.log('error catch ', error)
		);
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
			this.validateAndSubmitWord();
		}
		e.preventDefault();
		e.stopPropagation();
		return false;
	}

	focusFirstAvailableInput() {
		let input = $(".board-row").eq(this.state.currentRow).find('input:enabled:first');
		input.focus();
	}
	

	getCurrentWord() {
		let inputs = $(".board-row").eq(this.state.currentRow).find('input');
		let word = "";
		inputs.each(function(){
			word += $(this).val();
		});
		return word;
	}

	newLine() {
		const newRow = this.state.currentRow + 1;
		if(newRow >= this.state.nbRows){
			//END GAME
		}
		// go to next line
		this.setState({currentRow:newRow});
	}

	correctCurrentWord(diff) {
		let inputs = $(".board-row").eq(this.state.currentRow).find('input');
		let validLetters = this.state.validLetters;
		let solution = this.state.solution;
		inputs.each(function(i){
			$(this).addClass('color'+diff.charAt(i));
			if(diff.charAt(i) == '2'){
				validLetters = validLetters.replaceAt(i, solution.charAt(i));
			}
		});
		this.setState({'validLetters': validLetters});
		this.fillValidLetters(this.state.currentRow + 1);
	}

	validateAndSubmitWord() {
		let data = {
			'word': this.getCurrentWord(),
			'solution': this.state.solution,
		};
		let diff = false;

		fetch('http://localhost:8000/board/word-check', {
			'method': 'POST',
			'body': JSON.stringify(data),
		})
		.then(res => res.json())
		.then(
			(result) => {
				if(result.error){
					console.log('result.error ', result.error);
					return;
				}
				diff = result.diff;
			},
			(error) => console.log('(error) ', error)
		)
		.then(
			() => {
				if(diff){
					this.correctCurrentWord(diff);
				}
				this.newLine();
			}
		)
		.catch(
			(error) => console.log('error catch ', error)
		);
	}

}

const domContainer = document.querySelector('#board-container');
ReactDOM.render(e(Board), domContainer);
