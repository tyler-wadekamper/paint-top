class grid {
    constructor(sideLength) {
        this.sideLength = sideLength;
        this.mouseDownActive = false;
        this.currentColor = "#000000";
        this.numberOfCells = sideLength ** 2;
        this.previousColor = "#000000";
        this.cells = this.initCells(sideLength);
        this.gridContainerDiv = this.getGridContainerDiv();
        this.setGridContainerSideLength(this.sideLength);
        this.appendToGridContainer(this.gridContainerDiv);
        this.addMouseEventListeners();
        this.buttonBoard = new buttonBoard(this);
        this.colorPicker = this.initColorPicker();
        this.addColorPickerEventListener(this.colorPicker);
    }

    getGridContainerDiv() {
        return document.querySelector(".grid-container");
    }

    setGridContainerSideLength(sideLength) {
        this.gridContainerDiv.style["grid-template-columns"] = `repeat(${sideLength}, 1fr)`;
    }

    appendToGridContainer(container) {
        this.appendToParent(container);
    }

    addMouseEventListeners() {
        this.addMouseOverEventListeners();
        this.addMouseDownEventListener();
        this.addMouseUpEventListener();
    }

    addMouseOverEventListeners() {
        for (let id = 0; id < this.numberOfCells; id++) {
            this.cells[id].div.addEventListener('mouseover', handleMouseOver.bind(this));
        }
    }

    addMouseDownEventListener() {
        this.gridContainerDiv.addEventListener('mousedown', handleMouseDown.bind(this));
    }
    
    addMouseUpEventListener() {
        this.gridContainerDiv.addEventListener('mouseup', handleMouseUp.bind(this));
    }

    setSideLength(newSideLength) {
        this.cells = this.initCells(newSideLength);
        this.numberOfCells = newSideLength ** 2;
        this.sideLength = newSideLength;
    }   

    setCurrentColor(newColor) {
        this.currentColor = newColor;
    }

    setPreviousColorToCurrent() {
        this.previousColor = this.currentColor;
    }

    revertToPreviousColor() {
        this.setCurrentColor(this.previousColor);
    }

    clearGrid() {
        for (let id = 0; id < this.numberOfCells; id++) {
            this.cells[id].setFillColor("#FFFFFF");
        }
        if (this.buttonBoard.isPressed(this.eraserButton)) {
            this.revertToPreviousColor();
        }
        this.buttonBoard.setButtonNotPressed(this.buttonBoard.eraserButton);
    }

    setMouseDownActive(event) {
        this.mouseDownActive = true;
    }

    setMouseDownInactive() {
        this.mouseDownActive = false;
    }

    initCells(sideLength) {
        let cells = [];
        let newCell = null;
        for(let id = 0; id < (sideLength ** 2); id++) {
            newCell = new gridCell(id);
            cells.push(newCell);
        }
        return cells;
    }

    appendToParent(parentElement) {
        let numberOfCells = this.numberOfCells;
        for (let id = 0; id < numberOfCells; id++){
            parentElement.appendChild(this.cells[id].div);
        }
    }

    removeFromParent() {
        let parentElement = this.cells[0].div.parentElement;
        parentElement.textContent = "";
    }

    initColorPicker() {
        let colorPicker = new iro.ColorPicker('.color-picker', {
            width: 300,
            color: "#000000",
            borderWidth: 7,
            borderColor: "#000000"
        });
    
        return colorPicker;
    }

    addColorPickerEventListener() {
        this.colorPicker.on('color:change', handleColorChange.bind(this));
    }
}

class gridCell {
    constructor(id) {
        this.id = id;
        this.div = this.initDiv();
        this.setFillColor("#FFFFFF");
    }

    setFillColor(fillColor) {
        this.fillColor = fillColor;
        this.div.style["background-color"] = fillColor;
    }

    initDiv() {
        let newDiv = document.createElement('div');
        newDiv.classList.add("grid-cell");
        newDiv.setAttribute('id', this.id.toString());
        return newDiv;
    }
}

class buttonBoard {
    constructor(relatedGrid) {
        this.relatedGrid = relatedGrid;
        this.clearButton = this.getClearButton();
        this.sizeButton = this.getSizeButton();
        this.eraserButton = this.getEraserButton();
        this.colorButton = this.getColorButton();
        this.addEventListeners();
    }

    getClearButton() {
        return document.querySelector(".clear-button");
    }

    getSizeButton() {
        return document.querySelector(".size-button");
    }

    getEraserButton() {
        return document.querySelector(".eraser-button");
    }

    getColorButton() {
        return document.querySelector(".color-button");
    }

    addEventListeners() {
        this.addClearButtonEventListener();
        this.addSizeButtonEventListener();
        this.addEraserButtonEventListener();
        this.addColorButtonEventListener();
    }

    addClearButtonEventListener() {
        this.clearButton.addEventListener('mouseup', handleClearClick.bind(this.relatedGrid));
    }

    addSizeButtonEventListener() {
        this.sizeButton.addEventListener('click', handleSizeClick.bind(this.relatedGrid));
    }

    addEraserButtonEventListener() {
        this.eraserButton.addEventListener('click', handleEraserClick.bind(this.relatedGrid));
    }

    addColorButtonEventListener() {
        // this.colorButton.addEventListener('click', handleColorClick.bind(this.relatedGrid));
    }

    setButtonPressed(button) {
        button.classList.add("pressed");
    }

    setButtonNotPressed(button) {
        button.classList.remove("pressed");
    }

    isPressed(button) {
        if (button.className == "pressed") {
            return true;
        }
        return false;
    }
}

function handleMouseOver(event) {
    let cellId = event.target.id;
    if(this.mouseDownActive) {
        this.cells[cellId].setFillColor(this.currentColor);
    }
}

function handleMouseDown(event) {
    this.setMouseDownActive();
}

function handleMouseUp(event) {
    this.setMouseDownInactive();
}

function handleClearClick(event) {
    this.clearGrid();
}

function handleEraserClick(event) {
    if (this.currentColor != "#FFFFFF") {
        this.setPreviousColorToCurrent();
        this.setCurrentColor("#FFFFFF");
        this.buttonBoard.setButtonPressed(this.buttonBoard.eraserButton);
    }
    else if (this.currentColor == "#FFFFFF") {
        this.revertToPreviousColor();
        this.buttonBoard.setButtonNotPressed(this.buttonBoard.eraserButton);
    }
}

function handleSizeClick(event) {
    let newSize = prompt("Enter the size of new grid square (1 to 100): ");
    this.removeFromParent();
    let newGrid = new grid(Number(newSize));
}

function handleColorChange(color) {
    this.setCurrentColor(color.hexString);
}

function showColorPicker() {

}

function hideColorPicker() {

}

const DEFAULT_GRID_SIDE_LENGTH = 16;

let mainGrid = new grid(DEFAULT_GRID_SIDE_LENGTH);

