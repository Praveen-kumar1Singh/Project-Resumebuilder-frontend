import React, { useState } from "react";
import { Sparkles, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { generateAISummary } from "@/Services/AiModel"; // ✅ Changed import
import { updateThisResume } from "@/Services/resumeAPI";

function Summary({ resumeInfo, enanbledNext, enanbledPrev }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(resumeInfo?.summary || "");
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState(null);
  const { resume_id } = useParams();

  const handleInputChange = (e) => {
    enanbledNext(false);
    enanbledPrev(false);
    dispatch(
      addResumeData({
        ...resumeInfo,
        [e.target.name]: e.target.value,
      })
    );
    setSummary(e.target.value);
  };

  const onSave = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Started Saving Summary");
    const data = {
      data: { summary },
    };
    if (resume_id) {
      updateThisResume(resume_id, data)
        .then((data) => {
          toast("Resume Updated", "success");
        })
        .catch((error) => {
          toast("Error updating resume", `${error.message}`);
        })
        .finally(() => {
          enanbledNext(true);
          enanbledPrev(true);
          setLoading(false);
        });
    }
  };

  const setSummery = (summary) => {
    dispatch(
      addResumeData({
        ...resumeInfo,
        summary: summary,
      })
    );
    setSummary(summary);
  };

  // ✅ FIXED AI GENERATION FUNCTION
  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    console.log("Generate Summery From AI for", resumeInfo?.jobTitle);
    
    if (!resumeInfo?.jobTitle) {
      toast("Please Add Job Title");
      setLoading(false);
      return;
    }

    try {
      // ✅ Use the new function instead of AIChatSession
      const prompt = `Job Title: ${resumeInfo.jobTitle}. Generate 3 professional resume summaries for different experience levels (Senior, Mid-Level, Fresher) in 3-4 lines each. Return as JSON array with summary and experience_level fields.`;
      
      const aiResponse = await generateAISummary({
        position: resumeInfo.jobTitle,
        skills: resumeInfo.skills || "Not specified",
        experience: "Various levels"
      });

      // Try to parse JSON response
      try {
        const parsedData = JSON.parse(aiResponse);
        setAiGenerateSummeryList(parsedData);
        toast("Summary Generated", "success");
      } catch (parseError) {
        // If not JSON, create a simple array with the response
        console.log("AI returned text, not JSON. Creating manual structure.");
        const fallbackData = [
          {
            experience_level: "Professional",
            summary: aiResponse
          }
        ];
        setAiGenerateSummeryList(fallbackData);
        toast("Summary Generated", "success");
      }
      
    } catch (error) {
      console.log("AI Generation Error:", error);
      toast(error.message || "Failed to generate summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add Summary for your job title</p>

        <form className="mt-7" onSubmit={onSave}>
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
              disabled={loading}
            >
              {loading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate from AI
            </Button>
          </div>
          <Textarea
            name="summary"
            className="mt-5"
            required
            value={summary}
            onChange={handleInputChange}
            placeholder="Enter your professional summary..."
            rows={4}
          />
          <div className="mt-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </div>

      {aiGeneratedSummeryList && (
        <div className="my-5">
          <h2 className="font-bold text-lg">AI Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                enanbledNext(false);
                enanbledPrev(false);
                setSummery(item?.summary);
              }}
              className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border"
            >
              <h2 className="font-bold my-1 text-primary">
                {item?.experience_level || "Professional Summary"}
              </h2>
              <p className="text-gray-700">{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summary;
