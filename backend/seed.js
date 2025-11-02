// backend/seeders/seedTasks.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Task from "./models/Task.js";
import Employee from "./models/Employee.js";

dotenv.config();

const seedTasks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // delete old tasks
    const deleted = await Task.deleteMany({});
    console.log(`🧹 Deleted ${deleted.deletedCount} existing tasks`);

    // fetch employees
    const employees = await Employee.find({});
    if (employees.length === 0) {
      console.log("❌ No employees found. Seed employees first!");
      process.exit(1);
    }

    // predefined realistic tasks pool
    const taskTemplates = [
      {
        title: "Prepare Monthly Sales Report",
        description: "Collect and analyze sales data for this month and submit to management.",
        priority: "High",
      },
      {
        title: "Design Promotional Email",
        description: "Create a promotional email for upcoming offers using Canva templates.",
        priority: "Medium",
      },
      {
        title: "Client Onboarding Follow-up",
        description: "Reach out to new clients and assist with initial setup and questions.",
        priority: "High",
      },
      {
        title: "Team Meeting Preparation",
        description: "Prepare agenda and slides for the weekly team meeting.",
        priority: "Low",
      },
      {
        title: "Update CRM Leads",
        description: "Verify contact details and follow up with inactive leads in CRM system.",
        priority: "Medium",
      },
      {
        title: "Social Media Content Planning",
        description: "Plan and draft posts for next week’s social media calendar.",
        priority: "Low",
      },
      {
        title: "Prepare Financial Summary",
        description: "Summarize all expense and revenue sheets for management review.",
        priority: "High",
      },
      {
        title: "Customer Feedback Review",
        description: "Read and categorize feedback from customers and suggest improvements.",
        priority: "Medium",
      },
      {
        title: "Inventory Check",
        description: "Verify stock levels and prepare restock request if necessary.",
        priority: "Medium",
      },
      {
        title: "Project Documentation Update",
        description: "Ensure all project docs are updated with latest deliverables and deadlines.",
        priority: "Low",
      },
    ];

    const allTasks = [];

    // assign 1–6 random tasks per employee
    for (const employee of employees) {
      const taskCount = Math.floor(Math.random() * 6) + 1; // 1 to 6
      const usedTemplates = new Set();

      for (let i = 0; i < taskCount; i++) {
        // pick random unique task template
        let template;
        do {
          template =
            taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
        } while (usedTemplates.has(template.title));
        usedTemplates.add(template.title);

        allTasks.push({
          companyId: employee.companyId,
          title: template.title,
          description: template.description,
          assignedTo: employee._id,
          priority: template.priority,
          status: ["Pending", "In Progress", "Completed"][
            Math.floor(Math.random() * 3)
          ],
          dueDate: new Date(
            Date.now() + Math.floor(Math.random() * 10 + 3) * 24 * 60 * 60 * 1000
          ), // 3–13 days
        });
      }
    }

    await Task.insertMany(allTasks);
    console.log(`✅ Created ${allTasks.length} tasks across all employees.`);
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding tasks:", error);
    process.exit(1);
  }
};

seedTasks();
