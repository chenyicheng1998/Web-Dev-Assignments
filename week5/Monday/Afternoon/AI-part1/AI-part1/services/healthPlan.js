const model = require("./gemini");

const generateHealthPlan = async (age, gender, healthGoal, dietPreference, workoutDays) => {
  const prompt = `
You are a certified health and fitness consultant. Based on the user's details, create a **personalized health improvement plan** in **JSON format**.

### Schema Requirements:
{
  "health_plan": {
    "age": "number",
    "gender": "string",
    "goal": "string",
    "diet_preference": "string",
    "workout_days_per_week": "number",
    "weekly_workout_schedule": [
      {
        "day": "string",
        "focus": "string",
        "activities": [
          {
            "name": "string",
            "duration_minutes": "number",
            "intensity": "string"
          }
        ]
      }
    ],
    "nutrition_guidelines": {
      "daily_calories": "string",
      "macronutrient_breakdown": {
        "protein": "string",
        "carbs": "string",
        "fats": "string"
      },
      "meal_examples": [
        {
          "meal": "string",
          "foods": ["string"]
        }
      ]
    },
    "lifestyle_recommendations": ["string"],
    "progress_tracking_tips": ["string"]
  }
}

### User Input:
I am a ${age}-year-old ${gender} aiming to ${healthGoal}.
My diet preference is ${dietPreference}, and I can work out ${workoutDays} days per week.

Please:
- Provide a **weekly workout schedule** tailored to my goal.
- Suggest **nutrition guidelines** aligned with my diet preference.
- Include **lifestyle recommendations** to support my goal.
- Add **progress tracking tips**.
- Return the response in the exact JSON format above.
`;

  try {
    const result = await model(prompt);
    return result.text;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = generateHealthPlan;