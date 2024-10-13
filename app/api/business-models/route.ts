import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'lib', 'business-models.txt');
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const businessModels = fileContent.split('\n').map(line => {
    const [name, description, skills] = line.split('|');
    return { 
      name, 
      description, 
      requiredSkills: skills.split(',').map(skill => skill.trim())
    };
  });

  return NextResponse.json(businessModels);
}