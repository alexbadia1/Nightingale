module NightingaleCompiler {
    export class ProgramModel{
        private _memory: Array<string>;

        private _code_base: number;
        private _code_pointer: number;

        private _stack_base: number;
        private _stack_pointer: number;

        private _heap_base: number;
        private _heap_pointer: number;

        constructor(){
             this.init();
        }// constructor

        private init(): void {
            // Initialize 256 bytes of memory, with 0's
            for(let i: number = 0; i < MEMORY_BYTE_LIMIT/2; ++i) {
                this._memory.push("00");
            }// for

            // Code starts at beginning of memory
            this._code_base = 0;
            this._code_pointer = this._code_base;

            // Don't know where the stack will start yet
            this._stack_base = null;
            this._stack_pointer = this._stack_base;

            // Heap starts at end of memory
            this._heap_base = this._memory.length - 1;
            this._heap_pointer = this._heap_base;
        }// init
    }// class
}// module