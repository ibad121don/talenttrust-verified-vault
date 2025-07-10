
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, FileText, Plus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useSkillsManagement } from "@/hooks/useSkillsManagement";

interface SkillFormData {
  name: string;
  category: 'technical' | 'soft' | 'certification';
}

interface QualificationFormData {
  title: string;
  institution: string;
  dateObtained: string;
}

const ProfileSkills = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { skills, qualifications, isLoading, addSkill, removeSkill, addQualification, removeQualification } = useSkillsManagement(user?.id);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [isQualificationDialogOpen, setIsQualificationDialogOpen] = useState(false);

  const skillForm = useForm<SkillFormData>({
    defaultValues: {
      name: '',
      category: 'technical'
    }
  });

  const qualificationForm = useForm<QualificationFormData>({
    defaultValues: {
      title: '',
      institution: '',
      dateObtained: ''
    }
  });

  const onSkillSubmit = async (data: SkillFormData) => {
    await addSkill(data.name, data.category);
    skillForm.reset();
    setIsSkillDialogOpen(false);
  };

  const onQualificationSubmit = async (data: QualificationFormData) => {
    await addQualification({
      title: data.title,
      institution: data.institution,
      dateObtained: data.dateObtained || undefined
    });
    qualificationForm.reset();
    setIsQualificationDialogOpen(false);
  };

  const technicalSkills = skills.filter(skill => skill.category === 'technical');
  const softSkills = skills.filter(skill => skill.category === 'soft');
  const certifications = skills.filter(skill => skill.category === 'certification');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Qualifications</CardTitle>
        <CardDescription>Manage your skills and qualifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Technical Skills</h4>
              <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Skill</DialogTitle>
                    <DialogDescription>
                      Add a new skill to your profile
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...skillForm}>
                    <form onSubmit={skillForm.handleSubmit(onSkillSubmit)} className="space-y-4">
                      <FormField
                        control={skillForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skill Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., React, Python, Communication" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={skillForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="technical">Technical</SelectItem>
                                <SelectItem value="soft">Soft Skills</SelectItem>
                                <SelectItem value="certification">Certification</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">Add Skill</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-wrap gap-2">
              {technicalSkills.map((skill) => (
                <Badge key={skill.id} className={skill.verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {skill.verified && <Shield className="h-3 w-3 mr-1" />}
                  {skill.name}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-auto p-0 ml-2"
                    onClick={() => removeSkill(skill.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              {technicalSkills.length === 0 && (
                <p className="text-gray-500 text-sm">No technical skills added yet</p>
              )}
            </div>
          </div>

          {softSkills.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Soft Skills</h4>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((skill) => (
                  <Badge key={skill.id} className={skill.verified ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                    {skill.verified && <Shield className="h-3 w-3 mr-1" />}
                    {skill.name}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-auto p-0 ml-2"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Certifications</h4>
              <div className="flex flex-wrap gap-2">
                {certifications.map((skill) => (
                  <Badge key={skill.id} className={skill.verified ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}>
                    {skill.verified && <Shield className="h-3 w-3 mr-1" />}
                    {skill.name}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-auto p-0 ml-2"
                      onClick={() => removeSkill(skill.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Qualifications</h4>
              <Dialog open={isQualificationDialogOpen} onOpenChange={setIsQualificationDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Qualification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Qualification</DialogTitle>
                    <DialogDescription>
                      Add a new qualification or certification
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...qualificationForm}>
                    <form onSubmit={qualificationForm.handleSubmit(onQualificationSubmit)} className="space-y-4">
                      <FormField
                        control={qualificationForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Qualification Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Bachelor's Degree - Computer Science" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={qualificationForm.control}
                        name="institution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., University of XYZ, AWS" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={qualificationForm.control}
                        name="dateObtained"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date Obtained (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">Add Qualification</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="space-y-2">
              {qualifications.map((qualification) => (
                <div key={qualification.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className={`h-5 w-5 ${qualification.verified ? 'text-green-600' : 'text-gray-400'}`} />
                    <div>
                      <span className="font-medium">{qualification.title}</span>
                      <p className="text-sm text-gray-500">{qualification.institution}</p>
                      {qualification.dateObtained && (
                        <p className="text-xs text-gray-400">{new Date(qualification.dateObtained).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={qualification.verified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                      {qualification.verified ? "Verified" : "Pending"}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeQualification(qualification.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {qualifications.length === 0 && (
                <p className="text-gray-500 text-sm">No qualifications added yet</p>
              )}
            </div>
          </div>

          <Button onClick={() => navigate("/vault")}>
            View All Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSkills;
