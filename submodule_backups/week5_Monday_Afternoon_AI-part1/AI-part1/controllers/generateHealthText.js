const generateHealthPlan = require("../services/healthPlan");

const generateHealthText = async (req, res) => {
  try {
    const { age, gender, healthGoal, dietPreference, workoutDays } = req.body;

    if (!age || !gender || !healthGoal || !dietPreference || !workoutDays) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const markdownResponse = await generateHealthPlan(
      age,
      gender,
      healthGoal,
      dietPreference,
      workoutDays
    );

    const jsonMatch = markdownResponse.match(/```json\s*([\s\S]*?)\s*```/);

    if (!jsonMatch) {
      return res.status(500).json({ error: "Invalid response format. No JSON found." });
    }

    let healthPlan;
    try {
      healthPlan = JSON.parse(jsonMatch[1]);

      // Standardize caloric intake format if present
      if (healthPlan.health_plan?.nutrition_guidelines?.daily_calories) {
        const intakeRange = healthPlan.health_plan.nutrition_guidelines.daily_calories.match(/\d+/g);
        healthPlan.health_plan.nutrition_guidelines.daily_calories = {
          range: intakeRange ? intakeRange.join("-") : "Unknown",
          unit: "calories",
          notes: "Adjust based on individual needs and metabolism"
        };
      }
    } catch (parseError) {
      return res.status(500).json({ error: "Error parsing JSON response." });
    }

    res.json(healthPlan);
  } catch (err) {
    console.error("Error in generateHealthText:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

module.exports = generateHealthText;
