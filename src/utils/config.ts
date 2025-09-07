// Dependencies.
import fs from 'fs'
import YAML from 'yaml'

// Class for the instruction set.
class InstructionSet {
  id: string;
  name: string;
  description: string;
  instructions: string[];

  /**
   * Create a new instance of the instruction set class.
   */
  constructor(id: string, name: string, description: string, instructions: string[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.instructions = instructions;
  }
}

// Class for the instruction set.
class Chat {
  id: number | string;
  instructionSet: InstructionSet;

  /**
   * Create a new instance of the chat class.
   */
  constructor(id: number | string, instructionSet: InstructionSet) {
    this.id = id;
    this.instructionSet = instructionSet;
  }
}

// Class for the configuration.
export default class Config {
  // Chats.
  chats: Chat[];
  // Instruction sets.
  instructionSets: InstructionSet[];

  /**
   * Create a new instance of the Config class.
   */
  constructor(filePath: string) {
    // Init chats and instruction sets.
    this.chats = [];
    this.instructionSets = [];
    // Read the file.
    const file = fs.readFileSync(filePath, 'utf8');
    // Parse the file.
    const config = YAML.parse(file);

    // Loop through the chats.
    for (const chat of config.chats) {
      // Instruction set.
      const instructionSet = new InstructionSet(
        chat.instruction_set,
        config.instruction_sets[chat.instruction_set].name,
        config.instruction_sets[chat.instruction_set].description,
        config.instruction_sets[chat.instruction_set].instructions
      );
      // Save the instruction set to the instruction sets array.
      this.instructionSets.push(instructionSet);
      // Loop through the chat ids.
      for (const id of chat.ids) {
        // Save the chat and own instruction set to the chats array.
        this.chats.push(new Chat(id.toString(), instructionSet));
      }
    }
  }

  /**
   * Get instruction for a chat.
   */
  getInstructions(chatId: number | string) {
    // Loop through the chats.
    for (const chat of this.chats) {
      // Return the instructions based on the chat id.
      if (chat.id === chatId.toString()) {
        return chat.instructionSet.instructions;
      }
    }
    // Return the default instructions.
    return this.instructionSets.find(x => x.id === 'default')?.instructions;
  }
}
