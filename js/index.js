/// <reference path="js/index.d.ts" />
function inputHasFocus() {
    var inputs = document.getElementsByTagName("input");
    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i] === document.activeElement) {
            return true;
        }
    }
    return false;
}
document.addEventListener('keydown', function (e) {
    if (e.keyCode === 0 || e.keyCode === 32) {
        if (!inputHasFocus()) {
            e.preventDefault();
            output.new_arpeggio();
        }
    }
});
var toggle_options = false;
function toggle_show_input_options() {
    var show_input_options = document.getElementById("show-input-options");
    if (toggle_options) {
        show_input_options.innerHTML = "Show Options ▸";
        document.getElementsByClassName("input")[0].style.display = "none";
    }
    else {
        show_input_options.innerHTML = "Show Options ▾";
        document.getElementsByClassName("input")[0].style.display = "block";
    }
    toggle_options = !toggle_options;
}
var toggle_disabled = false;
function edit_disabled() {
    var inputs = document.getElementsByTagName('input');
    var edit_disabled_btn = document.getElementById('edit-disabled-btn');
    if (toggle_disabled) {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'checkbox')
                inputs[i].parentNode.style.display = 'none';
        }
        edit_disabled_btn.innerHTML = 'Edit Disabled';
    }
    else {
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].type == 'checkbox')
                inputs[i].parentNode.style.display = 'block';
        }
        edit_disabled_btn.innerHTML = 'Hide Disabled';
    }
    toggle_disabled = !toggle_disabled;
}
var OutputTable = /** @class */ (function () {
    function OutputTable(note_output, chord_output, root_position_output) {
        this.note_output = note_output;
        this.chord_output = chord_output;
        this.root_position_output = root_position_output;
    }
    OutputTable.prototype.new_arpeggio = function () {
        var random_note = note_table.permutate();
        var random_chord = chord_table.permutate();
        var random_root_position = root_position_table.permutate();
        if (random_note == null || random_chord == null || random_root_position == null) {
            error_message.show_error('All inputs cannot be disabled.');
            return;
        }
        note_table.highlight(random_note);
        chord_table.highlight(random_chord);
        root_position_table.highlight(random_root_position);
        document.getElementById(this.note_output).innerHTML = random_note.value;
        document.getElementById(this.chord_output).innerHTML = random_chord.value;
        document.getElementById(this.root_position_output).innerHTML = random_root_position.value;
        var chord_str = '';
        chord_str += random_note.value + ' ';
        switch (random_chord.value.toLowerCase()) {
            case 'major':
                chord_str += 'maj';
                break;
            case 'minor':
                chord_str += 'min';
                break;
            case 'major 13th':
                chord_str += 'maj13';
                break;
            case 'major 7th':
                chord_str += 'maj7';
                break;
            case 'major 9th':
                chord_str += 'maj9';
                break;
            case 'minor 6th':
                chord_str += 'min6';
                break;
            case 'minor 9th':
                chord_str += 'min9';
                break;
            case 'minor 7th':
                chord_str += 'min7';
                break;
            case 'minor/major 7th':
                chord_str += 'min(maj7)';
                break;
            case 'minor 13th':
                chord_str += 'min13';
                break;
            case 'suspended 2nd':
                chord_str += 'sus2';
                break;
            case 'suspended 4th':
                chord_str += 'sus4';
                break;
            case '7th suspended 4th':
                chord_str += '7sus4';
                break;
            case 'augmented':
                chord_str += 'aug';
                break;
            case 'diminished':
                chord_str += 'dim';
                break;
        }
        document.getElementById('chord-div').innerHTML = '';
        console.log(chord_str);
        Raphael.chord('chord-div', chord_str).element.setSize(250, 250);
    };
    return OutputTable;
}());
var InputTable = /** @class */ (function () {
    function InputTable(class_id, highlight_color) {
        this.class_id = class_id;
        this.highlight_color = highlight_color;
    }
    InputTable.prototype.clearTable = function () {
        document.getElementById(this.class_id).innerHTML = '';
    };
    InputTable.prototype.addHeader = function (title) {
        var table = document.getElementById(this.class_id);
        if (table) {
            table.insertAdjacentHTML('beforeend', "<tr>" +
                "<th>" + title + "</th>" +
                "</tr>");
        }
    };
    InputTable.prototype.addRow = function (value, checked) {
        if (checked === void 0) { checked = true; }
        var checked_str;
        var disabled_str;
        (checked) ? checked_str = 'checked' : checked_str = '';
        (toggle_disabled) ? disabled_str = 'block' : disabled_str = 'none';
        var table = document.getElementById(this.class_id);
        if (table) {
            table.insertAdjacentHTML('beforeend', "<tr>" +
                "<td>" +
                "<div class='input-checkbox-div' style='display:" + disabled_str + ";'>" +
                "<input type='checkbox' class='input-checkbox' " + checked_str + " onclick='this.blur();'>" +
                "</div>" +
                "<input type='text' class='input-text " + this.class_id + "' value='" + value + "'>" +
                "<div class='delete' onclick='this.parentNode.parentNode.remove();'>" +
                "<b>&times;</b>" +
                "</div>" +
                "</td>" +
                "</tr>");
        }
    };
    InputTable.prototype.get_all_inputs = function () {
        var inputs = document.getElementsByClassName(this.class_id);
        var input_vals = [];
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].parentNode.firstChild.firstChild.checked)
                input_vals.push({ v: inputs[i].value, c: true });
            else
                input_vals.push({ v: inputs[i].value, c: false });
        }
        return input_vals;
    };
    InputTable.prototype.highlight = function (element) {
        element.parentNode.style.backgroundColor = this.highlight_color;
    };
    InputTable.prototype.clear_highlight = function () {
        var inputs = document.getElementsByClassName(this.class_id);
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].parentNode.style.backgroundColor = "white";
        }
    };
    InputTable.prototype.validate = function () {
        var inputs = document.getElementsByTagName("input");
        var valid = true;
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value == "") {
                inputs[i].parentNode.style.backgroundColor = "#FF6666";
                error_message.show_error('Please fill in all empty inputs.');
                valid = false;
            }
        }
        return valid;
    };
    InputTable.prototype.disable = function (element) {
        element.parentNode.style.backgroundColor = '#f2f2f2'; // lighter gray
        element.style.color = '#dddddd'; // gray
    };
    InputTable.prototype.enable = function (element) {
        element.parentNode.style.backgroundColor = 'white';
        element.style.color = 'black';
    };
    InputTable.prototype.permutate = function () {
        this.clear_highlight();
        if (!this.validate())
            return '';
        error_message.clear_error();
        var input_divs = document.getElementsByClassName(this.class_id);
        var checked_divs = [];
        for (var i = 0; i < input_divs.length; i++) {
            var input_checkbox = input_divs[i].parentNode.firstChild.firstChild;
            if (!input_checkbox.checked) {
                this.disable(input_divs[i]);
            }
            else {
                this.enable(input_divs[i]);
                checked_divs.push(input_divs[i]);
            }
        }
        if (checked_divs.length == 0) {
            return null;
        }
        var random_input = checked_divs[Math.floor(Math.random() * checked_divs.length)];
        return random_input;
    };
    return InputTable;
}());
var ErrorMessage = /** @class */ (function () {
    function ErrorMessage(class_id) {
        this.class_id = class_id;
    }
    ErrorMessage.prototype.show_error = function (message) {
        document.getElementById(this.class_id).innerHTML = message;
    };
    ErrorMessage.prototype.clear_error = function () {
        document.getElementById(this.class_id).innerHTML = '';
    };
    return ErrorMessage;
}());
var current_option;
var states = {};
function load_default() {
    switch (current_option.name) {
        case 'chords':
            states.chords = chord_state;
            break;
        case 'scales':
            states.scales = scale_state;
            break;
        case 'custom':
            states.custom = custom_state;
            break;
    }
    load_data(current_option);
}
function preload_states() {
    states[document.getElementById('radio-btn-chords').name] = chord_state;
    states[document.getElementById('radio-btn-scales').name] = scale_state;
    states[document.getElementById('radio-btn-custom').name] = custom_state;
}
function set_current_option(new_option) {
    current_option = new_option;
}
function get_current_state() {
    var note_data = document.getElementsByClassName(note_table.class_id);
    var chord_data = document.getElementsByClassName(chord_table.class_id);
    var root_position_data = document.getElementsByClassName(root_position_table.class_id);
    var note_array = note_table.get_all_inputs();
    var chord_array = chord_table.get_all_inputs();
    var root_position_array = root_position_table.get_all_inputs();
    var state = {};
    switch (current_option.name) {
        case 'chords':
            state['headers'] = ['Note', 'Chord', 'Root Position'];
            break;
        case 'scales':
            state['headers'] = ['Note', 'Scale', 'Root Position'];
            break;
        case 'custom':
            state['headers'] = ['Note', 'Mode', 'Root Position'];
            break;
    }
    state['notes'] = note_array;
    state['chords'] = chord_array;
    state['root_positions'] = root_position_array;
    return state;
}
function load_data(new_option) {
    if (new_option === void 0) { new_option = null; }
    error_message.clear_error();
    // get the state of the new option
    var state = states[new_option.name];
    // if current option has not been set yet, set it
    if (!current_option) {
        set_current_option(new_option);
    }
    // snapshot the current state and save it, set the current state
    states[current_option.name] = get_current_state();
    set_current_option(new_option);
    // tick the correct checkbox
    document.getElementById('radio-btn-chords').checked = false;
    document.getElementById('radio-btn-scales').checked = false;
    document.getElementById('radio-btn-custom').checked = false;
    new_option.checked = true;
    note_table.clearTable();
    chord_table.clearTable();
    root_position_table.clearTable();
    if (state.headers.length == 3) {
        note_table.addHeader(state.headers[0]);
        chord_table.addHeader(state.headers[1]);
        root_position_table.addHeader(state.headers[2]);
    }
    for (var i = 0; i < state.notes.length; i++) {
        note_table.addRow(state.notes[i].v, state.notes[i].c);
    }
    for (var i = 0; i < state.chords.length; i++) {
        chord_table.addRow(state.chords[i].v, state.chords[i].c);
    }
    for (var i = 0; i < state.root_positions.length; i++) {
        root_position_table.addRow(state.root_positions[i].v, state.root_positions[i].c);
    }
    // output.new_arpeggio();
}
var chord_state = {
    headers: ['Note', 'Chord', 'Root Position'],
    notes: [
        { v: 'A', c: true },
        { v: 'Bb', c: true },
        { v: 'B', c: true },
        { v: 'C', c: true },
        { v: 'C#', c: true },
        { v: 'D', c: true },
        { v: 'Eb', c: true },
        { v: 'E', c: true },
        { v: 'F', c: true },
        { v: 'F#', c: true },
        { v: 'G', c: true },
        { v: 'G#', c: true },
    ],
    chords: [
        { v: 'Major', c: true },
        { v: 'Major 6th Add 9', c: true },
        { v: 'Major 7th', c: true },
        { v: 'Major 9th', c: true },
        { v: 'Major Add 9', c: true },
        { v: 'Major 13th', c: true },
        { v: 'Minor', c: true },
        { v: 'Minor 6th', c: true },
        { v: 'Minor 9th', c: true },
        { v: 'Minor 7th b5', c: true },
        { v: 'Minor 7th', c: true },
        { v: 'Minor/Major 7th', c: true },
        { v: 'Minor Add 9', c: true },
        { v: 'Minor 13th', c: true },
        { v: 'Suspended 2nd', c: true },
        { v: 'Suspended 4th', c: true },
        { v: '7th Suspended 4th', c: true },
        { v: '7th Suspended 2nd', c: true },
        { v: 'Augmented', c: true },
        { v: 'Diminished', c: true },
        { v: 'Augmented 7th', c: true },
        { v: 'Diminished 7th', c: true },
        { v: 'Half Diminished 7th', c: true },
    ],
    root_positions: [
        { v: '1st String', c: true },
        { v: '2nd String', c: true },
        { v: '3rd String', c: true },
        { v: '4th String', c: true },
        { v: '5th String', c: true },
        { v: '6th String', c: true },
    ]
};
var scale_state = {
    headers: ['Note', 'Scale', 'Root Position'],
    notes: [
        { v: 'A', c: true },
        { v: 'Bb', c: true },
        { v: 'B', c: true },
        { v: 'C', c: true },
        { v: 'C#', c: true },
        { v: 'D', c: true },
        { v: 'Eb', c: true },
        { v: 'E', c: true },
        { v: 'F', c: true },
        { v: 'F#', c: true },
        { v: 'G', c: true },
        { v: 'G#', c: true },
    ],
    chords: [
        { v: 'Ionian', c: true },
        { v: 'Dorian', c: true },
        { v: 'Phrygian', c: true },
        { v: 'Lydian', c: true },
        { v: 'Mixolydian', c: true },
        { v: 'Aeolian', c: true },
        { v: 'Locrian', c: true },
        { v: 'Minor Blues', c: true },
        { v: 'Major Blues', c: true },
        { v: 'Harmonic Minor', c: true },
        { v: 'Melodic Minor (Jazz Minor)', c: true },
        { v: 'Ionian Augmented (Ionian #5)', c: true },
        { v: 'Overtone Minor (Dorian #4)', c: true },
        { v: 'Phrygian Dominant (Spanish Phrygian)', c: true },
        { v: 'Lydian #2', c: true },
        { v: 'Lydian Dominant (Lydian b7)', c: true },
        { v: 'Lydian Augmented (Lydian #5)', c: true },
        { v: 'Aeolian Dominant (Mixolydian b6)', c: true },
        { v: 'Locrian #2', c: true },
        { v: 'Super Lydian (Altered Dominant)', c: true },
        { v: 'Harmonic Major', c: true },
        { v: 'Dorian b5', c: true },
        { v: 'Lydian Diminished (Lydian b3)', c: true },
        { v: 'Mixolydian b2', c: true },
        { v: 'Bebop Major', c: true },
        { v: 'Bebop Minor', c: true },
        { v: 'Bebop Dominant', c: true },
        { v: 'Bebop Blues', c: true },
        { v: 'Whole Tone', c: true },
        { v: 'Whole/Half Diminished', c: true },
        { v: 'Half/Whole Diminished', c: true },
    ],
    root_positions: [
        { v: '1st String', c: true },
        { v: '2nd String', c: true },
        { v: '3rd String', c: true },
        { v: '4th String', c: true },
        { v: '5th String', c: true },
        { v: '6th String', c: true },
    ]
};
var custom_state = {
    headers: ['Note', 'Mode', 'Root Position'],
    notes: [{ v: '', c: true },],
    chords: [{ v: '', c: true },],
    root_positions: [{ v: '', c: true },]
};
var output;
var note_table;
var chord_table;
var root_position_table;
var error_message;
window.onload = function () {
    console.log("console loaded");
    output = new OutputTable('note-output', 'chord-output', 'root-position-output');
    note_table = new InputTable("note-table", "#FED172");
    chord_table = new InputTable("chord-table", "#AEEAFF");
    root_position_table = new InputTable("root-position-table", '#FFB2E0');
    error_message = new ErrorMessage('error-message');
    preload_states();
    load_data(document.getElementById('radio-btn-chords'));
    output.new_arpeggio();
};
