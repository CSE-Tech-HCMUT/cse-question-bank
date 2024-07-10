package usecase

import (
	"cse-question-bank/pkg/execute"
	"fmt"
	"os"
	"time"
)

// createfolder -> get folder name
// set output-directory to new folder
// call PdfLatexCompile with output.tex and args: output-directory, -interaction=batchmode
// open file to check then Readfile with os package
// delete folder
// return file
func (u *latexCompilerImpl) LatexCompile(content string) ([]byte, error) {
	folderPath, err := createFolder()
	if err != nil {
		return nil, err
	}
	defer deleteFolder(folderPath)

	args := []string{
		"-output-directory=" + folderPath,
		"-interaction=batchmode",
	}
	err = pdfLatexCompile(folderPath+"/output.tex", args...)
	if err != nil {
		return nil, err
	}

	pdfFile, err := os.Open(folderPath + "/output.pdf")
	if err != nil {
		fmt.Print("1")
		return nil, err
	}
	defer pdfFile.Close()

	pdfContent, err := os.ReadFile(folderPath + "/output.pdf")
	if err != nil {
		fmt.Print("2")
		return nil, err
	}

	return pdfContent, nil
}

func pdfLatexCompile(filename string, args ...string) error {
	return latextool("pdflatex", filename, args...)
}

func latextool(toolname string, filename string, args ...string) error {
	execute := execute.NewExecutor(10 * time.Second)
	args = append(args, filename)
	
	err := execute.RunCommand(toolname, args...)
	if err != nil {
		return err
	}

	return nil
}
