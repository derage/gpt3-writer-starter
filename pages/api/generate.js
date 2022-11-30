import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateAction = async (req, res) => {
    const basePromptPrefix =
    `
    create a title for a short story about ${req.body.userInput} written by Dr. Seuss. 

    Title: 
    `
  console.log(`API: ${basePromptPrefix}`)

  const baseCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${basePromptPrefix}`,
    temperature: 0.8,
    max_tokens: 250,
  });
  
  const basePromptOutput = baseCompletion.data.choices.pop();

  // I build Prompt #2.
  const secondPrompt = 
  `
  Prommpt: create a summerized plot for a story about ${req.body.userInput} written by Dr. Seuss. the plot should have a sad climax, but happy ending.

  Title: ${basePromptOutput.text}

  Plot: 
  `

  console.log(`API: ${secondPrompt}`)
  
  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.8,
		// I also increase max_tokens.
    max_tokens: 250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();

  console.log(`secondPromptOutput: ${secondPromptOutput.text}`)

  const thirdPrompt = 
  `
  write a short story that rhymes like a Dr. Seuss story about ${req.body.userInput}. make sure it has a happy beginning, a sad middle part, and happy ending. no death or any thing dark.

  Title: ${basePromptOutput.text}

  Plot: ${secondPromptOutput.text}

  Story: 
  `

  console.log(`API: ${thirdPrompt}`)
  const thirddPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${thirdPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.5,
		// I also increase max_tokens.
    max_tokens: 250,
  });
  const thirdPromptOutput = thirddPromptCompletion.data.choices.pop();

  // Send over the Prompt #2's output to our UI instead of Prompt #1's.
  res.status(200).json({ output: thirdPromptOutput });
};

export default generateAction;
