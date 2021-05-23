var NightingaleCompiler;
(function (NightingaleCompiler) {
    class ProgramModel {
        constructor(new_id) {
            this._id = new_id;
            this.init();
        } // constructor
        init() {
            this._memory = [];
            this._memory_address_base = 0;
            this._memory_address_limit = MAX_MEMORY_SIZE - 1; //
            // Initialize 256 bytes of memory, with 0's
            for (let i = this._memory_address_base; i <= this._memory_address_limit; ++i) {
                this._memory.push("00");
            } // for
            // Code starts at beginning of memory
            this._code_base = 0;
            // End of code starts at the code's base, but will grow over time
            this._code_limit = this._code_base - 1;
            // Don't know where the stack will start yet
            this._stack_base = null;
            // End of stack starts at the stacks base, but will grow over time
            this._stack_limit = null;
            // Heap starts at end of memory
            this._heap_base = this._memory.length - 1;
            // End of heap starts at the heap's base, but will grow over time
            this._heap_limit = this._heap_base + 1;
            // Initialize heap with null, true, false, pointers
            this.write_string_to_heap("null");
            this._null_address = this._heap_limit;
            this.write_string_to_heap("false");
            this._false_address = this._heap_limit;
            this.write_string_to_heap("true");
            this._true_address = this._heap_limit;
        } // init
        get_id() {
            return this._id;
        } // get_id
        /**
         * Writes a hex pair to the code.
         *
         * Modifying the internals of a code is allowed and done
         * by specifiying a valid logical address that is inside the code.
         *
         * If no logical address is specified, the hex pair will be appended to
         * the end of the code causing the code to grow and possibly resulting in collisions.
         *
         * Note that the code must be expanded contiguously.
         *
         * @param hex_pair hex pair to write to code
         * @param logical_address logical address in memory to write hex pair
         */
        write_to_code(hex_pair, logical_address = (this._code_limit + 1)) {
            // Avoid invalid hex pairs
            if (!this._is_valid_hex_pair(hex_pair)) {
                throw Error(`Invalid Hex Pair, cannot write to code ${hex_pair} to L${logical_address}!`);
            } // if
            // I know we're not in OS anymore but to make debugging easier...
            // Ensure valid addressing of memory, logically, physically, and metaphysically.
            let physical_address = this._get_physical_address(this._code_base, logical_address);
            // Code must be appended synchronous
            if (physical_address > (this._code_limit + 1)) {
                throw Error(`Code must be contigous, writing to code ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            // Avoid heap collisions
            //
            // Allows the user to change 6502a op codes within the code section memory
            // This will be particularly useful for backtracking.
            if (physical_address >= this._heap_limit) {
                throw Error(`Heap Collision writing to code ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            // Explicitly banning self modifying code via the stack or heap.
            // That is out of the scope of this class, and a lot of brain damage all considering...
            if (this._stack_base !== null) {
                if (physical_address >= this._stack_base) {
                    throw Error(`Self Modifying Code Error writing ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!
                    Self modifiying code is explicitly prohibited! If the [stack base] is non-null, that means backpatching is or 
                    was already performed. Meaning, there should not be any new code entries that would cause the code section to grow.`);
                } // if
            } // if
            // Write to code
            //console.log(`Code: Writing ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]`);
            this._memory[physical_address] = hex_pair;
            // User did not specify a logical address, so hex_pair was written to the end of the code
            if (physical_address === (this._code_limit + 1)) {
                this._code_limit++;
            } // if
        } // write_to_code
        /**
         * Writes a hex pair to the stack.
         *
         * Modifying the internals of a stack is allowed and done
         * by specifiying a valid logical address that is inside the stack.
         *
         * If no logical address is specified, the hex pair will be appended to
         * the end of the stack causing the heap to grow and possibly resulting in collisions.
         *
         * Note that the stack must be expanded contiguously.
         *
         * @param hex_pair hex pair to write to stack
         * @param logical_address logical address in memory to write hex pair
         */
        write_to_stack(hex_pair, logical_address = null) {
            // When writing to the stack make sure a base was specified
            if (this._stack_base === null || this._stack_limit === null) {
                throw Error(`Stack base was never specified!`);
            } // if
            else {
                logical_address = this._stack_limit - this._stack_base + 1;
            } // else
            // Avoid invalid hex pairs
            if (!this._is_valid_hex_pair(hex_pair)) {
                throw Error(`Invalid Hex Pair, cannot write to stack ${hex_pair} to L${logical_address}!`);
            } // if
            // I know we're not in OS anymore but to make debugging easier...
            // Ensure valid addressing of memory, logically, physically, and metaphysically.
            let physical_address = this._get_physical_address(this._stack_base, logical_address);
            // Avoid code collisions, again no self modifying code...
            if (physical_address <= this._code_limit) {
                throw Error(`Code Collision writing to stack ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            // Avoid heap collisions
            if (physical_address >= this._heap_limit) {
                throw Error(`Heap Collision writing to stack ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            // Ensure contigous expansion of the stack
            if (physical_address > (this._stack_limit + 1)) {
                throw Error(`Stack must be contigous, writing to stack ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            // Write to stack
            // console.log(`Stack: Writing ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]`);
            this._memory[physical_address] = hex_pair;
            // Stack just grew
            if (physical_address = (this._stack_limit + 1)) {
                this._stack_limit++;
            } // if
        } // write_to_stack
        /**
         * Writes a hex pair to the heap.
         *
         * Modifying the internals of a heap is allowed and done
         * by specifiying a valid logical address that is inside the heap.
         *
         * If no logical address is specified, the hex pair will be appended to
         * the end of the heap causing the heap to grow and possibly resulting in collisions.
         *
         * Note that the heap must be expanded contiguously.
         *
         * @param hex_pair hex pair to write to heap
         * @param logical_address logical address in memory to write hex pair
         */
        write_to_heap(hex_pair, logical_address = this._heap_base - this._heap_limit + 1) {
            // Avoid invalid hex pairs
            if (!this._is_valid_hex_pair(hex_pair)) {
                throw Error(`Invalid Hex Pair, cannot write to heap ${hex_pair} to L${logical_address}!`);
            } // if
            let physical_address = this._heap_base - logical_address;
            if (physical_address < this._memory_address_base) {
                throw Error(`Memory Lower Bound Limit Reached, cannot write ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            if (physical_address > this._memory_address_limit) {
                throw Error(`Memory Upper Bound Limit Reached, cannot write ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            // Avoid code collisions
            if (physical_address <= this._code_limit) {
                throw Error(`Code Collision writing to heap ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            // If the stack was specified, ensure no stack collisions
            if (this._stack_base !== null && this._stack_limit !== null) {
                if (physical_address <= this._stack_limit) {
                    throw Error(`Stack Collision writing to heap ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
                } // if
            } // if
            // Ensure the heap is CONTIGOUSLY expanded
            if (physical_address < (this._heap_limit - 1)) {
                throw Error(`Heap must be contigous, writing to heap ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            // Write to heap
            // console.log(`Heap: Writing ${hex_pair} to L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]`);
            this._memory[physical_address] = hex_pair;
            // Heap just grew
            if (physical_address === this._heap_limit - 1) {
                this._heap_limit--;
            } // if
        } // write_to_heap
        write_string_to_heap(str) {
            str = str.split("\"").join("");
            // console.log(`Writing the string [${str}] to the heap...`);
            // Null termination for string
            this.write_to_heap("00");
            for (let i = str.length - 1; i >= 0; --i) {
                let ascii_value_in_hex = str[i].charCodeAt(0).toString(16).toUpperCase();
                this.write_to_heap(ascii_value_in_hex);
            } // for
            // console.log(`[${str}] starts at P${this._heap_limit}[${this._heap_limit.toString(16).toUpperCase().padStart(2, "0")}]`);
            return this._heap_limit.toString(16).toUpperCase().padStart(2, "0");
        } // write_string_to_heap
        _is_valid_hex_pair(hex_pair) {
            // Allow T's and $'s for temporary locations
            return /([A-F]|[0-9]|[T]|[J]|[\$])([A-F]|[0-9]|[T]|[J]|[\$])/.test(hex_pair);
        } // is_valid_hex_pair
        /**
         * I know we're not in OS anymore but to make debugging easier...
         * Ensure valid addressing of memory, logically, physically, metaphysically, and spiritually.
         *
         * @param logical_address specified address in memory to write to
         * @param hex_pair hex pair that will be written to memory
         * @returns the physical address in memory, calculated from the logical
         */
        _get_physical_address(base, logical_address) {
            let physical_address = logical_address + base;
            if (physical_address < this._memory_address_base) {
                throw Error(`Memory Lower Bound Limit Reached, cannot access L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            if (physical_address > this._memory_address_limit) {
                throw Error(`Memory Upper Bound Limit Reached, cannot access L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            return physical_address;
        } // get_physical_address
        initialize_stack() {
            this._stack_base = this._code_limit + 1;
            this._stack_limit = this._stack_base - 1;
        } // initialize_stack
        read_code_area(logical_address) {
            let physical_address = this._get_physical_address(this._code_base, logical_address);
            if (physical_address > this._code_limit) {
                throw Error(`Code Memory Upper Bound Limit Reached, cannot read L${logical_address}:P${physical_address}[${physical_address.toString(16).toUpperCase().padStart(2, "0")}]!`);
            } // if
            return this._memory[physical_address];
        } // read_code_area
        get_null_address() {
            return this._null_address;
        } // getNullAddress
        get_false_address() {
            return this._false_address;
        } // getNullAddress
        get_true_address() {
            return this._true_address;
        } // getNullAddress
        get_code_base() {
            return this._code_base;
        } // getCodeBase
        get_code_limit() {
            return this._code_limit;
        } // get_code_limit
        get_stack_base() {
            return this._stack_base;
        } // getCodeBase
        get_heap_limit() {
            return this._heap_limit;
        } // getHeapLimit
        get_code_area_size() {
            return this._code_limit - this._code_base + 1;
        } // get_code_area_size
        memory() {
            let ans = "";
            for (let byte of this._memory) {
                ans += byte + " ";
            } // for
            return ans;
        } // toString
    } // class
    NightingaleCompiler.ProgramModel = ProgramModel;
})(NightingaleCompiler || (NightingaleCompiler = {})); // module
//# sourceMappingURL=program_model.js.map