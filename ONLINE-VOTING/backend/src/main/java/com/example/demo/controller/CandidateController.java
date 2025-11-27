package com.example.demo.controller;

import com.example.demo.model.Candidates;
import com.example.demo.service.CandidatesService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/candidates")
@CrossOrigin(origins = "http://localhost:5173") // Add CORS support for frontend
public class CandidateController {

    private final CandidatesService candidateService;

    // Directory to store uploaded images
    private static final String UPLOAD_DIR = "uploads/candidates/";

    public CandidateController(CandidatesService candidateService) {
        this.candidateService = candidateService;
    }

    @GetMapping
    public List<Candidates> getAllCandidates() {
        return candidateService.getAllCandidates();
    }

    @GetMapping("/{id}")
    public Optional<Candidates> getCandidateById(@PathVariable Long id) {
        return candidateService.getCandidateById(id);
    }

    @GetMapping("/election/{electionId}")
    public List<Candidates> getCandidatesByElection(@PathVariable Long electionId) {
        return candidateService.getCandidatesByElection(electionId);
    }

    @PostMapping
    public Candidates addCandidate(@RequestBody Candidates candidate) {
        System.out.println("=== INCOMING CANDIDATE REQUEST ===");
        System.out.println("Request body: " + candidate);
        if (candidate != null) {
            System.out.println("Voter: " + (candidate.getVoter() != null ? candidate.getVoter().getId() : "null"));
            System.out.println(
                    "Election: " + (candidate.getElections() != null ? candidate.getElections().getId() : "null"));
            System.out.println("Post: " + candidate.getPost());
            System.out.println("Bio: " + candidate.getBio());
        }
        System.out.println("==================================");

        Candidates result = candidateService.addCandidates(candidate);

        System.out.println("=== RESPONSE ===");
        System.out.println("Saved candidate ID: " + (result != null ? result.getCandidateId() : "null"));
        System.out.println("===============");

        return result;
    }

    // New endpoint to handle candidate creation with image upload
    @PostMapping(consumes = "multipart/form-data")
    public Candidates addCandidateWithImage(
            @RequestPart("candidate") Candidates candidate,
            @RequestPart(value = "image", required = false) MultipartFile imageFile) {

        System.out.println("=== INCOMING CANDIDATE REQUEST WITH IMAGE ===");
        System.out.println("Candidate data: " + candidate);

        // Handle image upload if provided
        if (imageFile != null && !imageFile.isEmpty()) {
            try {
                String imageUrl = saveImage(imageFile);
                candidate.setImageUrl(imageUrl);
                System.out.println("Image saved at: " + imageUrl);
            } catch (IOException e) {
                System.err.println("Failed to save image: " + e.getMessage());
            }
        }

        Candidates result = candidateService.addCandidates(candidate);

        System.out.println("=== RESPONSE ===");
        System.out.println("Saved candidate ID: " + (result != null ? result.getCandidateId() : "null"));
        System.out.println("===============");

        return result;
    }

    @PutMapping("/{id}")
    public Candidates updateCandidate(@PathVariable Long id, @RequestBody Candidates candidateDetails) {
        return candidateService.updateCandidates(id, candidateDetails);
    }

    @DeleteMapping("/{id}")
    public String deleteCandidates(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return "Candidate with candidate_id " + id + " deleted successfully!";
    }

    // Helper method to save image file
    private String saveImage(MultipartFile imageFile) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = StringUtils.cleanPath(imageFile.getOriginalFilename());
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Save file to disk
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return relative URL for accessing the image
        return "/uploads/candidates/" + uniqueFilename;
    }

    // Helper method to extract file extension
    private String getFileExtension(String filename) {
        if (filename == null || filename.lastIndexOf('.') == -1) {
            return "";
        }
        return filename.substring(filename.lastIndexOf('.'));
    }
}