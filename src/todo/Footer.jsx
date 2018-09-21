import '../assets/style/footer.scss'

export default {
	data(){
		return {
			author:'Jabo'
		}
	},
	render(){
		return (
			<div id="footer">
				<span>Written by {this.author}</span>
			</div>
		)
	}
}