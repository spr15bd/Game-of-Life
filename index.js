class GenerationClock extends React.Component {
  				constructor(props) {
    					super(props);
    					this.state={
      						generation:0
    					};
    					this.timer=this.timer.bind(this);
  				}
  				componentDidMount() {
    					this.interval = setInterval(this.timer, this.props.speed);
  				}
  				timer() {
    					if (!this.props.finished) {
      						this.setState({generation:this.state.generation+1});
      						this.props.update();
    					}
    
  				}
  				resetTimer() {
    					clearTimeout(this.interval); 
    					this.setState({generation:0});
    					this.props.restart();
    					this.paused=false;
    					this.interval = setInterval(this.timer, this.props.speed);
  				}
  				// deal with change in speed
  				componentWillReceiveProps(nextProps) {
    					if(nextProps.speed !== this.props.speed){
      						this.paused=false;
      						clearTimeout(this.interval); 
      						this.interval = setInterval(this.timer, nextProps.speed);
    					}
   				}
  				pauseTimer() {
    					this.paused=!this.paused;
    					if (this.paused) {
      						clearTimeout(this.interval);
    					} else {
      						this.interval = setInterval(this.timer, this.props.speed);
    					}
  				}
  				clear() {
    					clearTimeout(this.interval); 
    					this.setState({generation:0});
    					this.props.clear();
  				}
  				render() {
    					return(
      						<div id="buttons">
        						<div id="clock">
          							<div className="generation-clock">Generation {this.state.generation}</div>
        						</div>
        						<div className="generation-clock" onClick={() => this.resetTimer() }>
          							Start
        						</div>
        						<div className="generation-clock" onClick={() => this.pauseTimer() }>
          							Pause
        						</div>
        						<div className="generation-clock" onClick={() => this.clear() }>
          							Clear
        						</div>
      						</div>
   	 				);
  				}
			}
			function Buttons(props) {
  				return(
    					<div id="buttons">
      						<div id="size">
        						<div className="set-board-size" onClick={() => props.updateDimensions(50, 30)}>
          							50x30
        						</div>
        						<div className="set-board-size" onClick={() => props.updateDimensions(70, 50)}>
          							70x50
        						</div>
        						<div className="set-board-size" onClick={() => props.updateDimensions(90, 70)}>
          							90x70
        						</div>
      						</div>
      						<div id="speed">
        						<div className="set-sim-speed" onClick={() => props.updateSpeed(300)}>
          							slow
        						</div>
        						<div className="set-sim-speed" onClick={() => props.updateSpeed(200)}>
          							med
        						</div>
        						<div className="set-sim-speed" onClick={() => props.updateSpeed(100)}>
          							fast
        						</div>
      						</div>
    					</div>
  				);
			}
			function Grid(props) {
  				const grid = [];
  				for (var j=0; j<props.height; j++) {
    					for (var i=0; i<props.width; i++) {
      						let squareId="square"+props.currentBoard[i][j];
      						let tempX=i;
      						let tempY=j;
      						grid.push(
        						<div id={squareId} onClick={() => props.makeSquareLive(tempX, tempY)}>
        						</div>
      						);
    					}
  				}
  				let gridWidth="grid-"+props.width;
  				return(
    					<div id={gridWidth}>
      						{grid}
    					</div>
  				);
			}

			class Main extends React.Component {
  				constructor(props) {
    					super(props);
    					this.state={
      						x:50,
      						y:30,
      						squareStatus:[[]],
      						speed:300
    					};
    					this.changeDimensions=this.changeDimensions.bind(this);
    					this.changeSpeed=this.changeSpeed.bind(this);
    					this.updateGrid=this.updateGrid.bind(this);
    					this.resetGrid=this.resetGrid.bind(this);
    					this.updateSquare=this.updateSquare.bind(this);
    					this.clear=this.clear.bind(this);
    					this.squares = new Array(this.state.x);
    					for (var i=0; i<this.state.x; i++) {
      						this.squares[i]=new Array(this.state.y);
      						for (var j=0; j<this.state.y; j++) {
        						if (Math.random()<0.085) {
          							this.squares[i][j]=1;
        						} else {
          							this.squares[i][j]=0;
        						}
      						}
    					}
  				}
  				//set grid state for the first time
  				componentWillMount() {
    					this.setState({squareStatus:this.squares});
  				}
  				changeDimensions(newX, newY) {
    					// whenever grid size is changed we must also reinitialise the board to fit new size
    					this.squares=new Array(newX);
    					for (var i=0; i<newX; i++) {
      						this.squares[i]=new Array(newY);
      						for (var j=0;j<newY; j++) {
        						if (i<this.state.x&&j<this.state.y) {
          							this.squares[i][j]=this.state.squareStatus[i][j]; 
        						} else {
          							this.squares[i][j]=0;
        						}
      						}
    					}
    					this.setState({x:newX, y:newY});
    					this.setState({squareStatus:this.squares});
  				}
  				updateGrid() {
    					var displayChanged=false;
    					var p,q,r,s;
    					for(var i=0; i<this.state.x; i++) {
      						p=i-1;
      						if (p<0) {
        						p=this.state.x-1;
      						} 
      						q=i+1;
      						if (q>=this.state.x) {
        						q=0;
      						}
      						for (var j=0; j<this.state.y; j++) {
        						r=j-1;
        						if (r<0) {
          							r=this.state.y-1;
        						} 
        						s=j+1;
        						if (s>=this.state.y) {
          							s=0;
        						}  
        						var totalLiveNeighbours=this.state.squareStatus[p][j]+this.state.squareStatus[q][j]+this.state.squareStatus[i][r]+this.state.squareStatus[i][s]+this.state.squareStatus[p][r]+this.state.squareStatus[q][r]+this.state.squareStatus[p][s]+this.state.squareStatus[q][s];
        						if (this.state.squareStatus[i][j]==1&&totalLiveNeighbours<2) {
          							this.squares[i][j]=0;
          							displayChanged=true;
        						} else if (this.state.squareStatus[i][j]==1&&(totalLiveNeighbours==2||totalLiveNeighbours==3)) {
          							this.squares[i][j]=1;
        						} else if (this.state.squareStatus[i][j]==1&&totalLiveNeighbours>3) {
          							this.squares[i][j]=0;
          							displayChanged=true;
        						} else if (this.state.squareStatus[i][j]==0&&totalLiveNeighbours==3) {
          							this.squares[i][j]=1;
          							displayChanged=true;
       		 					}
      						}
    					}
    					if (!displayChanged) {
      						this.end=true;
    					}
    					this.setState({squareStatus:this.squares});
  				}
  				resetGrid() {
    					this.end=false;
    					for(var i=0; i<this.state.x; i++) {
      						for (var j=0; j<this.state.y; j++) {
        						if (Math.random()<0.085) {
          							this.squares[i][j]=1;
        						} else {
          							this.squares[i][j]=0;
        						}
      						}
    					}
    					this.setState({squareStatus:this.squares});
  				}
  				clear() {
    					for (var i=0; i<this.state.x; i++) {
      						for (var j=0; j<this.state.y; j++) {
        						this.squares[i][j]=0;
        						this.setState({squareStatus:this.squares});
      						}
    					}
    					this.end=true;
  				}
  				changeSpeed(newSpeed) {
    					this.setState({speed:newSpeed});
  				}
  				updateSquare(p, q) {
    					this.squares[p][q]=1;
    					this.setState({squareStatus:this.squares});
  				}
  				render() {
    					return(
      						<div id="container-fluid">
        						<div id="title">The game of life
        						</div>
        						<div id="controls">
          							<GenerationClock update={this.updateGrid} speed={this.state.speed} restart={this.resetGrid} clear={this.clear} finished={this.end}/>
        						</div>
        						<div id="grid-section">
          							<Grid width={this.state.x} height={this.state.y} currentBoard={this.state.squareStatus} makeSquareLive={this.updateSquare}/>
        						</div>
        						<div id="controls">
          							<Buttons updateDimensions={this.changeDimensions} updateSpeed={this.changeSpeed}/>
        						</div>
      						</div>
    					);
  				}
			}
			ReactDOM.render (
  				<Main />, 
  				document.getElementById('root')
			);
