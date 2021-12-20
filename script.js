class grid {
    constructor(sideLength) {
        this.sideLength = sideLength;
        this.mouseDownActive = false;
        this.currentColor = "#000000";
        this.numberOfCells = sideLength ** 2;
        this.previousColor = "#000000";
        this.cells = this.initCells(sideLength);
    }

    setSideLength(newSideLength) {
        this.cells = this.initCells(newSideLength);
        this.numberOfCells = newSideLength ** 2;
        this.sideLength = newSideLength;
    }   

    setCurrentColor(newColor) {
        this.currentColor = newColor;
    }

    saveCurrentColorAsPrevious() {
        this.previousColor = this.currentColor;
    }

    revertToPreviousColor() {
        this.setCurrentColor(this.previousColor);
    }

    clearGrid() {
        for (let id = 0; id < this.numberOfCells; id++) {
            this.cells[id].setFillColor("#FFFFFF");
        }
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

class controlButton {
    constructor(cssClass, eventType, eventHandler, relatedPage) {
        this.isPressed = false;
        this.cssClass = cssClass;
        this.eventType = eventType;
        this.eventHandler = eventHandler;
        this.relatedPage = relatedPage;
        this.buttonElement = this.getButtonElement();
        this.addEventListener();
    }

    getButtonElement() {
        return document.querySelector(`.${this.cssClass}`);
    }

    addEventListener() {
        this.buttonElement.addEventListener(`${this.eventType}`, this.eventHandler.bind(this.relatedPage));
    }

    togglePressed() {
        if (this.isPressed) {
            this.isPressed = false;
            this.removeCssPressedClass();
            return;
        }
        this.isPressed = true;
        this.addCssPressedClass();
    }

    addCssPressedClass() {
        this.buttonElement.classList.add("pressed");
    }

    removeCssPressedClass() {
        this.buttonElement.classList.remove("pressed");
    }
}

class buttonBoard {
    constructor(relatedPage) {
        this.relatedPage = relatedPage;
        this.clearButton = new controlButton('clear-button', 'mouseup', handleClearClick, this.relatedPage);
        this.sizeButton = new controlButton('size-button', 'click', handleSizeClick, this.relatedPage);
        this.eraserButton = new controlButton('eraser-button', 'click', handleEraserClick, this.relatedPage);
        this.colorButton = new controlButton('color-button', 'click', handleColorClick, this.relatedPage);
    }
}

class pageContent {
    constructor(gridSize) {
        this.pageGrid = new grid(gridSize);
        this.attachGridToPage();
        this.buttonBoard = new buttonBoard(this);
        this.colorPicker = this.initColorPicker();
        this.addColorPickerEventListener(this.colorPicker);
        this.colorPickerVisible = false;
    }
    
    attachGridToPage() {
        this.gridContainerDiv = this.getGridContainerDiv();
        this.setGridContainerSideLength(this.pageGrid.sideLength);
        this.appendToGridContainer(this.gridContainerDiv);
        this.addMouseEventListeners();
    }

    getGridContainerDiv() {
        return document.querySelector(".grid-container");
    }

    setGridContainerSideLength(sideLength) {
        this.gridContainerDiv.style["grid-template-columns"] = `repeat(${sideLength}, 1fr)`;
    }

    appendToGridContainer(container) {
        this.pageGrid.appendToParent(container);
    }

    addMouseEventListeners() {
        this.addMouseOverEventListeners();
        this.addMouseDownEventListener();
        this.addMouseUpEventListener();
    }

    addMouseOverEventListeners() {
        for (let id = 0; id < this.pageGrid.numberOfCells; id++) {
            this.pageGrid.cells[id].div.addEventListener('mouseover', handleMouseOver.bind(this.pageGrid));
        }
    }

    addMouseDownEventListener() {
        this.gridContainerDiv.addEventListener('mousedown', handleMouseDown.bind(this.pageGrid));
    }
    
    addMouseUpEventListener() {
        this.gridContainerDiv.addEventListener('mouseup', handleMouseUp.bind(this.pageGrid));
    }

    initColorPicker() {
        let colorPicker = new iro.ColorPicker('.color-picker', {
            width: 300,
            color: "#000000",
            borderWidth: 7,
            borderColor: "#000000",
            handleRadius: 15
        });
        this.hideColorPicker();
    
        return colorPicker;
    }

    addColorPickerEventListener() {
        this.colorPicker.on('color:change', handleColorChange.bind(this));
    }

    toggleColorPickerVisibility() {
        if(this.colorPickerVisible) {
            this.hideColorPicker();
            this.colorPickerVisible = false;
        } 
        else {
            this.showColorPicker();
            this.colorPickerVisible = true;
        }
    }

    hideColorPicker() {
        let colorPickerDiv = document.querySelector(".color-picker");
        colorPickerDiv.style.display = "none";
    }

    showColorPicker() {
        let colorPickerDiv = document.querySelector(".color-picker");
        colorPickerDiv.style.display = "block";
    }

    createNewGrid(newSize) {
        this.pageGrid = new grid(newSize);
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
    this.pageGrid.clearGrid();
    if (this.buttonBoard.eraserButton.isPressed) {
        this.buttonBoard.eraserButton.togglePressed();
        this.pageGrid.revertToPreviousColor();
    }
}

function handleEraserClick(event) {
    let eraserButton = this.buttonBoard.eraserButton;
    if(eraserButton.isPressed) {
        this.pageGrid.revertToPreviousColor();
    }
    else {
        this.pageGrid.saveCurrentColorAsPrevious();
        this.pageGrid.setCurrentColor("#FFFFFF");
    }
    eraserButton.togglePressed();
}

function handleSizeClick(event) {
    let newSize = prompt("Enter the size of new grid square (1 to 100): ");
    let oldCurrentColor = this.pageGrid.currentColor;
    let oldPreviousColor = this.pageGrid.previousColor;
    this.pageGrid.clearGrid();
    this.pageGrid.removeFromParent();
    this.createNewGrid(Number(newSize));
    this.pageGrid.currentColor = oldCurrentColor;
    this.pageGrid.previousColor = oldPreviousColor;
    this.attachGridToPage();
}

function handleColorClick(event) {
    this.buttonBoard.colorButton.togglePressed();
    this.toggleColorPickerVisibility();
}

function handleColorChange(color) {
    this.pageGrid.setCurrentColor(color.hexString);
}

const DEFAULT_GRID_SIDE_LENGTH = 16;

let mainPageContent = new pageContent(DEFAULT_GRID_SIDE_LENGTH);