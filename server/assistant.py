import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

# Define the function schema for controlling lights
light_control_schema = {
    "name": "control_light",
    "description": "Control a smart light by turning it on or off",
    "parameters": {
        "type": "object",
        "properties": {
            "light_id": {
                "type": "string",
                "description": "The ID of the light to control (1, 2, or 'all')"
            },
            "action": {
                "type": "string",
                "enum": ["on", "off"],
                "description": "The action to perform on the light"
            }
        },
        "required": ["light_id", "action"]
    }
}

def process_command(text):
    """
    Process a command using GPT-4o mini with function calling
    
    Args:
        text (str): The transcribed text from the user
        
    Returns:
        dict: Response containing the action to take
    """
    try:
        # Call GPT-4o mini with function calling
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a smart home assistant that controls lights. Your job is to understand user commands and convert them to function calls."},
                {"role": "user", "content": text}
            ],
            tools=[{"type": "function", "function": light_control_schema}],
            tool_choice={"type": "function", "function": {"name": "control_light"}}
        )
        
        # Extract function call
        message = response.choices[0].message
        
        if hasattr(message, 'tool_calls') and message.tool_calls:
            # Extract function call arguments
            function_call = message.tool_calls[0]
            function_args = json.loads(function_call.function.arguments)
            
            # Prepare response
            light_id = function_args.get("light_id")
            action = function_args.get("action")
            
            # Format a user-friendly response
            if light_id == "all":
                response_text = f"Turning {action} all lights"
            else:
                response_text = f"Turning {action} light {light_id}"
            
            return {
                "action": action,
                "light_id": light_id,
                "response_text": response_text
            }
        else:
            # If no function call was made, return a default response
            return {
                "response_text": "I'm sorry, I couldn't understand that command. Please try again."
            }
    
    except Exception as e:
        print(f"Error processing command: {e}")
        return {
            "response_text": "Sorry, there was an error processing your request."
        }
