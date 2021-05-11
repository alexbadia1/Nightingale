module NightingaleCompiler {
    export class CodeGeneration {
        private _memory: Array<string>;

        private _code_base: number;
        private _code_pointer: number;

        private _stack_base: number;
        private _stack_pointer: number;

        private _heap_base: number;
        private _heap_pointer: number;

        constructor(){
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
        }// constructor

        private code_gen(current_node: Node): void {
            switch (current_node.name) {
                case NODE_NAME_BLOCK:
                    this._code_gen_block(current_node);
                    break;
                case NODE_NAME_VARIABLE_DECLARATION:
                    this._code_gen_variable_decalration(current_node);
                    break;
                case NODE_NAME_ASSIGNMENT_STATEMENT:
                    this._code_gen_assignment_statement(current_node);
                    break;
                case NODE_NAME_PRINT_STATEMENT:
                    this._code_gen_print_statement(current_node);
                    break;
                case NODE_NAME_IF_STATEMENT:
                    this._code_gen_if_statement(current_node);
                    break;
                case NODE_NAME_WHILE_STATEMENT:
                    this._code_gen_while_statement(current_node);
                    break;
                default:
                    throw Error("ERROR: Invalid Node found on the AST: " + current_node.name);
            }// switch
        }// code_gen

        private _code_gen_block(current_node: Node): void {
            throw Error("Unimplemented error: block code generation has not yet been implemented!");
        }// _code_gen_block

        private _code_gen_variable_decalration(current_node: Node): void {
            throw Error("Unimplemented error: variable declaration code generation has not yet been implemented!");
        }// _code_gen_variable_decalration

        private _code_gen_assignment_statement(current_node: Node): void {
            throw Error("Unimplemented error: assignment statement code generation has not yet been implemented!");
        }// _code_gen_assignment_statement

        private _code_gen_print_statement(current_node: Node): void {
            throw Error("Unimplemented error: Print statement code generation has not yet been implemented!");
        }// _code_gen_print_statement

        private _code_gen_if_statement(current_node: Node): void {
            throw Error("Unimplemented error: If statement code generation has not yet been implemented!");
        }// _code_gen_if_statement

        private _code_gen_while_statement(current_node: Node): void {
            throw Error("Unimplemented error: While statement code generation has not yet been implemented!");
        }// _code_gen_while_statement
    }//class
}// module
