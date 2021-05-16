var NightingaleCompiler;
(function (NightingaleCompiler) {
    class ProgramModel {
        constructor() {
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
            this._stack_limit = this._stack_base - 1;
            // Heap starts at end of memory
            this._heap_base = this._memory.length - 1;
            // End of heap starts at the heap's base, but will grow over time
            this._heap_limit = this._heap_base + 1;
            // Write "null" to heap
            // Null's location is the heap base
            console.log(`Writing null to heap...`);
            this.write_string_to_heap("null");
            this._null_address = this._heap_limit;
            console.log(`Wrote null to heap starting at ${this._null_address}`);
            // Write "false" to heap, starting at FB or 251
            console.log(`Writing false to heap...`);
            this.write_string_to_heap("false");
            this._false_address = this._heap_limit;
            console.log(`Wrote false to heap starting at ${this._false_address}`);
            // Write "true", starting at 246
            console.log(`Writing true to heap...`);
            this.write_string_to_heap("true");
            this._true_address = this._heap_limit;
            console.log(`Wrote true to heap starting at ${this._true_address}`);
        } // init
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
            let physical_address = this._get_physical_address(this._code_base, logical_address, hex_pair);
            // Code must be appended synchronous
            if (physical_address > (this._code_limit + 1)) {
                throw Error(`Code must be contigous, writing to code ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            // Avoid heap collisions
            //
            // Allows the user to change 6502a op codes within the code section memory
            // This will be particularly useful for backtracking.
            if (physical_address >= this._heap_limit) {
                throw Error(`Heap Collision writing to code ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            // Explicitly banning self modifying code via the stack or heap.
            // That is out of the scope of this class, and a lot of brain damage all considering...
            if (this._stack_base !== null) {
                if (physical_address < this._stack_base) {
                    throw Error(`Self Modifying Code Error writing ${hex_pair} to L${logical_address}:P${physical_address}!
                    Self modifiying code is explicitly prohibited! If the [stack base] is non-null, that means backpatching is or 
                    was already performed. Meaning, there should not be any new code entries that would cause the code section to grow.`);
                } // if
            } // if
            // Write to code
            console.log(`Code: Writing ${hex_pair} to L${logical_address}:P${physical_address}`);
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
        write_to_stack(hex_pair, logical_address = this._stack_limit) {
            // When writing to the stack make sure a base was specified
            if (this._stack_base === null || this._stack_limit === null) {
                throw Error(`Stack base was never specified!`);
            } // if
            else {
                logical_address++;
            } // else
            // Avoid invalid hex pairs
            if (!this._is_valid_hex_pair(hex_pair)) {
                throw Error(`Invalid Hex Pair, cannot write to stack ${hex_pair} to L${logical_address}!`);
            } // if
            // I know we're not in OS anymore but to make debugging easier...
            // Ensure valid addressing of memory, logically, physically, and metaphysically.
            let physical_address = this._get_physical_address(this._stack_base, logical_address, hex_pair);
            // Avoid code collisions, again no self modifying code...
            if (physical_address <= this._code_limit) {
                throw Error(`Code Collision writing to stack ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            // Avoid heap collisions
            if (physical_address >= this._heap_limit) {
                throw Error(`Heap Collision writing to stack ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            // Ensure contigous expansion of the stack
            if (physical_address > (this._stack_limit + 1)) {
                throw Error(`Stack must be contigous, writing to stack ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            // Write to stack
            console.log(`Stack: Writing ${hex_pair} to L${logical_address}:P${physical_address}`);
            this._memory[physical_address] = hex_pair;
            // Stack just greww
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
                throw Error(`Memory Lower Bound Limit Reached, cannot write ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            if (physical_address > this._memory_address_limit) {
                throw Error(`Memory Upper Bound Limit Reached, cannot write ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            // Avoid code collisions
            if (physical_address <= this._code_limit) {
                throw Error(`Code Collision writing to heap ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            // If the stack was specified, ensure no stack collisions
            if (this._stack_base !== null && this._stack_limit !== null) {
                if (physical_address <= this._stack_limit) {
                    throw Error(`Stack Collision writing to heap ${hex_pair} to L${logical_address}:P${physical_address}!`);
                } // if
            } // if
            // Ensure the heap is CONTIGOUSLY expanded
            if (physical_address < (this._heap_limit - 1)) {
                throw Error(`Heap must be contigous, writing to heap ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            // Write to heap
            console.log(`Heap: Writing ${hex_pair} to L${logical_address}:P${physical_address}`);
            this._memory[physical_address] = hex_pair;
            // Heap just grew
            if (physical_address === this._heap_limit - 1) {
                this._heap_limit--;
            } // if
        } // write_to_heap
        write_string_to_heap(str) {
            str = str.split("\"").join("");
            console.log(str);
            // Null termination for string
            this.write_to_heap("00");
            for (let i = str.length - 1; i >= 0; --i) {
                let ascii_value_in_hex = str[i].charCodeAt(0).toString(16).toUpperCase();
                this.write_to_heap(ascii_value_in_hex);
            } // for
        } // write_string_to_heap
        _is_valid_hex_pair(hex_pair) {
            // Allow T's and $'s for temporary locations
            return /([A-F]|[0-9]|[T]|[\$])([A-F]|[0-9]|[T]|[\$])/.test(hex_pair);
        } // is_valid_hex_pair
        /**
         * I know we're not in OS anymore but to make debugging easier...
         * Ensure valid addressing of memory, logically, physically, metaphysically, and spiritually.
         *
         * @param logical_address specified address in memory to write to
         * @param hex_pair hex pair that will be written to memory
         * @returns the physical address in memory, calculated from the logical
         */
        _get_physical_address(base, logical_address, hex_pair) {
            let physical_address = logical_address + base;
            if (physical_address < this._memory_address_base) {
                throw Error(`Memory Lower Bound Limit Reached, cannot write ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            if (physical_address > this._memory_address_limit) {
                throw Error(`Memory Upper Bound Limit Reached, cannot write ${hex_pair} to L${logical_address}:P${physical_address}!`);
            } // if
            return physical_address;
        } // calculate_physical_address
        getNullAddress() {
            return this._null_address;
        } // getNullAddress
        getFalseAddress() {
            return this._false_address;
        } // getNullAddress
        getTrueAddress() {
            return this._true_address;
        } // getNullAddress
        getHeapLimit() {
            return this._heap_limit;
        } // getHeapLimit
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