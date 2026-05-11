/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, IconButton, Snackbar, Switch, TextField,
  Tooltip, Typography,
} from "@mui/material";

// ── Import from your service file ─────────────────────────────
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addSession,
  updateSession,
  deleteSession,
} from "../services/BannerService"; // ← adjust path if needed

// ── Styles ────────────────────────────────────────────────────
const S = {
  primary:   "#dc2626",
  primaryHv: "#b91c1c",
  bg:        "#f8fafc",
  card:      "#ffffff",
  border:    "#e2e8f0",
  text:      "#0f172a",
  muted:     "#64748b",
};

const btn = (variant = "primary") => ({
  bgcolor:      variant === "primary" ? S.primary : variant === "danger" ? "#fee2e2" : "#f1f5f9",
  color:        variant === "primary" ? "#fff"    : variant === "danger" ? S.primary : S.text,
  fontWeight:   600,
  borderRadius: "8px",
  textTransform: "none",
  px: 2.5,
  py: 1,
  "&:hover": {
    bgcolor: variant === "primary" ? S.primaryHv : variant === "danger" ? "#fecaca" : "#e2e8f0",
  },
});

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    fontSize: 14,
    "& fieldset": { borderColor: S.border },
    "&:hover fieldset": { borderColor: "#94a3b8" },
    "&.Mui-focused fieldset": { borderColor: S.primary },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: S.primary },
};

// ── Empty session template ─────────────────────────────────────
const emptySession = () => ({
  sessionNumber: "",
  title:         "",
  subtitle:      "",
  resources:     [{ label: "📹 Video", url: "" }, { label: "📋 Doc", url: "" }],
});

// ─────────────────────────────────────────────────────────────
// SESSION FORM (add / edit)
// ─────────────────────────────────────────────────────────────
function SessionForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial || emptySession());

  const setField = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const setResource = (i, k, v) =>
    setForm(p => {
      const r = [...p.resources];
      r[i] = { ...r[i], [k]: v };
      return { ...p, resources: r };
    });

  const addResource    = () => setForm(p => ({ ...p, resources: [...p.resources, { label: "", url: "" }] }));
  const removeResource = (i) => setForm(p => ({ ...p, resources: p.resources.filter((_, idx) => idx !== i) }));

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <TextField
            label="Session Number"
            type="number"
            fullWidth
            size="small"
            value={form.sessionNumber}
            onChange={e => setField("sessionNumber", e.target.value)}
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <TextField
            label="Title"
            fullWidth
            size="small"
            value={form.title}
            onChange={e => setField("title", e.target.value)}
            placeholder="LLD Introduction + Core Concepts"
            sx={inputSx}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Subtitle"
            fullWidth
            size="small"
            value={form.subtitle}
            onChange={e => setField("subtitle", e.target.value)}
            placeholder="Foundation★ Start Here"
            sx={inputSx}
          />
        </Grid>
      </Grid>

      {/* Resources */}
      <Box mt={2.5}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography fontWeight={600} fontSize={13} color={S.muted} textTransform="uppercase" letterSpacing={1}>
            Resources
          </Typography>
          <Button size="small" onClick={addResource} sx={{ ...btn("ghost"), py: 0.5, fontSize: 12 }}>
            + Add Resource
          </Button>
        </Box>

        {form.resources.map((r, i) => (
          <Box key={i} display="flex" gap={1.5} mb={1.5} alignItems="center">
            <TextField
              size="small"
              label="Label"
              value={r.label}
              onChange={e => setResource(i, "label", e.target.value)}
              sx={{ ...inputSx, width: 160 }}
              placeholder="📹 Video"
            />
            <TextField
              size="small"
              label="URL"
              value={r.url}
              onChange={e => setResource(i, "url", e.target.value)}
              sx={{ ...inputSx, flex: 1 }}
              placeholder="https://drive.google.com/..."
            />
            <Tooltip title="Remove">
              <IconButton size="small" onClick={() => removeResource(i)} sx={{ color: S.primary }}>
                ✕
              </IconButton>
            </Tooltip>
          </Box>
        ))}
      </Box>

      <Box display="flex" gap={1.5} mt={3}>
        <Button variant="contained" sx={btn("primary")} disabled={saving} onClick={() => onSave(form)}>
          {saving ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Save Session"}
        </Button>
        <Button sx={btn("ghost")} onClick={onCancel}>Cancel</Button>
      </Box>
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// SESSION ROW
// ─────────────────────────────────────────────────────────────
function SessionRow({ session, courseId, onRefresh, setSnack }) {
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleUpdate = async (form) => {
    setSaving(true);
    try {
      await updateSession(courseId, session._id, form);
      setSnack("Session updated");
      setEditing(false);
      onRefresh();
    } catch {
      setSnack("Failed to update session");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this session?")) return;
    setDeleting(true);
    try {
      await deleteSession(courseId, session._id);
      setSnack("Session deleted");
      onRefresh();
    } catch {
      setSnack("Failed to delete session");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box
      sx={{
        border: `1px solid ${S.border}`,
        borderRadius: "10px",
        p: 2,
        mb: 1.5,
        bgcolor: editing ? "#fef2f2" : "#f8fafc",
        transition: "background .2s",
      }}
    >
      {editing ? (
        <SessionForm
          initial={{ ...session }}
          onSave={handleUpdate}
          onCancel={() => setEditing(false)}
          saving={saving}
        />
      ) : (
        <Box display="flex" alignItems="flex-start" justifyContent="space-between" gap={2}>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Chip
                label={`Session ${session.sessionNumber}`}
                size="small"
                sx={{ bgcolor: S.primary, color: "#fff", fontWeight: 700, fontSize: 11 }}
              />
              <Typography fontWeight={700} fontSize={15}>{session.title}</Typography>
            </Box>
            {session.subtitle && (
              <Typography fontSize={13} color={S.muted} mt={0.3}>{session.subtitle}</Typography>
            )}
            <Box display="flex" gap={1} mt={1} flexWrap="wrap">
              {session.resources?.map((r, i) => (
                <Chip
                  key={i}
                  label={r.label}
                  size="small"
                  component="a"
                  href={r.url}
                  target="_blank"
                  clickable
                  sx={{ fontSize: 12, bgcolor: "#fff", border: `1px solid ${S.border}` }}
                />
              ))}
            </Box>
          </Box>
          <Box display="flex" gap={1} flexShrink={0}>
            <Button size="small" sx={btn("ghost")} onClick={() => setEditing(true)}>Edit</Button>
            <Button size="small" sx={btn("danger")} disabled={deleting} onClick={handleDelete}>
              {deleting ? <CircularProgress size={14} /> : "Delete"}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

// ─────────────────────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────────────────────
function CourseCard({ course, onRefresh, setSnack }) {
  const [expanded,       setExpanded]       = useState(false);
  const [addingSession,  setAddingSession]  = useState(false);
  const [savingSession,  setSavingSession]  = useState(false);
  const [editingCourse,  setEditingCourse]  = useState(false);
  const [courseForm,     setCourseForm]     = useState({ title: course.title, isPublished: course.isPublished });
  const [savingCourse,   setSavingCourse]   = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(false);
  const [sessions,       setSessions]       = useState(course.sessions || []);

  // Refresh sessions list — service already unwraps .data, so res = { course: {...} }
  const refreshSessions = async () => {
    try {
      const res = await getCourseById(course._id);
      setSessions(res.course.sessions || []);
    } catch {}
  };

  const handleAddSession = async (form) => {
    setSavingSession(true);
    try {
      await addSession(course._id, form);
      setSnack("Session added");
      setAddingSession(false);
      refreshSessions();
      onRefresh();
    } catch {
      setSnack("Failed to add session");
    } finally {
      setSavingSession(false);
    }
  };

  const handleUpdateCourse = async () => {
    setSavingCourse(true);
    try {
      await updateCourse(course._id, courseForm);
      setSnack("Course updated");
      setEditingCourse(false);
      onRefresh();
    } catch {
      setSnack("Failed to update course");
    } finally {
      setSavingCourse(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm(`Delete "${course.title}"?`)) return;
    setDeletingCourse(true);
    try {
      await deleteCourse(course._id);
      setSnack("Course deleted");
      onRefresh();
    } catch {
      setSnack("Failed to delete course");
    } finally {
      setDeletingCourse(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 2.5,
        border: `1px solid ${S.border}`,
        borderRadius: "14px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        overflow: "visible",
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        {/* Course Header */}
        {editingCourse ? (
          <Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Course Title"
                  fullWidth
                  size="small"
                  value={courseForm.title}
                  onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))}
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Switch
                    checked={courseForm.isPublished}
                    onChange={e => setCourseForm(p => ({ ...p, isPublished: e.target.checked }))}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: S.primary },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: S.primary },
                    }}
                  />
                  <Typography fontSize={13}>{courseForm.isPublished ? "Published" : "Draft"}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box display="flex" gap={1.5} mt={2}>
              <Button sx={btn("primary")} disabled={savingCourse} onClick={handleUpdateCourse}>
                {savingCourse ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Save"}
              </Button>
              <Button sx={btn("ghost")} onClick={() => setEditingCourse(false)}>Cancel</Button>
            </Box>
          </Box>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Box display="flex" alignItems="center" gap={1.5} flex={1}>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight={700} fontSize={17}>{course.title}</Typography>
                  <Chip
                    label={course.isPublished ? "Published" : "Draft"}
                    size="small"
                    sx={{
                      bgcolor: course.isPublished ? "#dcfce7" : "#fef9c3",
                      color:   course.isPublished ? "#166534" : "#854d0e",
                      fontWeight: 600, fontSize: 11,
                    }}
                  />
                </Box>
                <Typography fontSize={13} color={S.muted}>{course.totalSessions} sessions</Typography>
              </Box>
            </Box>
            <Box display="flex" gap={1}>
              <Button size="small" sx={btn("ghost")} onClick={() => setExpanded(p => !p)}>
                {expanded ? "▲ Hide" : "▼ Sessions"}
              </Button>
              <Button size="small" sx={btn("ghost")} onClick={() => setEditingCourse(true)}>Edit</Button>
              <Button size="small" sx={btn("danger")} disabled={deletingCourse} onClick={handleDeleteCourse}>
                {deletingCourse ? <CircularProgress size={14} /> : "Delete"}
              </Button>
            </Box>
          </Box>
        )}

        {/* Sessions Panel */}
        {expanded && (
          <Box mt={2.5}>
            <Divider sx={{ mb: 2 }} />

            {sessions.length === 0 && !addingSession && (
              <Typography color={S.muted} fontSize={14} textAlign="center" py={2}>
                No sessions yet. Add one below.
              </Typography>
            )}

            {sessions
              .slice()
              .sort((a, b) => a.sessionNumber - b.sessionNumber)
              .map(s => (
                <SessionRow
                  key={s._id}
                  session={s}
                  courseId={course._id}
                  onRefresh={refreshSessions}
                  setSnack={setSnack}
                />
              ))}

            {addingSession ? (
              <Box
                sx={{
                  border: `1px dashed ${S.primary}`,
                  borderRadius: "10px",
                  p: 2.5,
                  mt: 1.5,
                  bgcolor: "#fff5f5",
                }}
              >
                <Typography fontWeight={700} fontSize={14} mb={2} color={S.primary}>
                  New Session
                </Typography>
                <SessionForm
                  onSave={handleAddSession}
                  onCancel={() => setAddingSession(false)}
                  saving={savingSession}
                />
              </Box>
            ) : (
              <Button
                fullWidth
                sx={{
                  ...btn("ghost"),
                  mt: 1,
                  border: `1px dashed ${S.border}`,
                  justifyContent: "center",
                }}
                onClick={() => setAddingSession(true)}
              >
                + Add Session
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN — CourseManager
// ─────────────────────────────────────────────────────────────
export default function CourseManager() {
  const [courses,        setCourses]        = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [creatingCourse, setCreatingCourse] = useState(false);
  const [savingNew,      setSavingNew]      = useState(false);
  const [newCourse,      setNewCourse]      = useState({ title: "", isPublished: false });
  const [snack,          setSnackState]     = useState({ open: false, message: "" });

  const setSnack = (message) => setSnackState({ open: true, message });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      // Service returns r.data directly, so res = { courses: [...] }
      const res = await getAllCourses();
      setCourses(res.courses || []);
    } catch {
      setSnack("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleCreateCourse = async () => {
    if (!newCourse.title.trim()) { setSnack("Course title is required"); return; }
    setSavingNew(true);
    try {
      await createCourse(newCourse);
      setSnack("Course created");
      setCreatingCourse(false);
      setNewCourse({ title: "", isPublished: false });
      fetchCourses();
    } catch {
      setSnack("Failed to create course");
    } finally {
      setSavingNew(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: S.bg, minHeight: "100vh" }}>
      {/* Page Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h5" fontWeight={800} color={S.text}>Course Manager</Typography>
          <Typography fontSize={13} color={S.muted}>{courses.length} courses total</Typography>
        </Box>
        <Button
          variant="contained"
          sx={btn("primary")}
          onClick={() => setCreatingCourse(p => !p)}
        >
          {creatingCourse ? "Cancel" : "+ New Course"}
        </Button>
      </Box>

      {/* Create Course Form */}
      {creatingCourse && (
        <Card
          sx={{
            mb: 3,
            border: `1px dashed ${S.primary}`,
            borderRadius: "14px",
            bgcolor: "#fff5f5",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Typography fontWeight={700} fontSize={15} mb={2} color={S.primary}>
              New Course
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={8}>
                <TextField
                  label="Course Title"
                  fullWidth
                  size="small"
                  value={newCourse.title}
                  onChange={e => setNewCourse(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Low Level Design"
                  sx={inputSx}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Switch
                    checked={newCourse.isPublished}
                    onChange={e => setNewCourse(p => ({ ...p, isPublished: e.target.checked }))}
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: S.primary },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: S.primary },
                    }}
                  />
                  <Typography fontSize={13}>{newCourse.isPublished ? "Published" : "Draft"}</Typography>
                </Box>
              </Grid>
            </Grid>
            <Box mt={2} display="flex" gap={1.5}>
              <Button sx={btn("primary")} disabled={savingNew} onClick={handleCreateCourse}>
                {savingNew ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : "Create Course"}
              </Button>
              <Button sx={btn("ghost")} onClick={() => setCreatingCourse(false)}>Cancel</Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Course List */}
      {loading ? (
        <Box display="flex" justifyContent="center" pt={6}>
          <CircularProgress sx={{ color: S.primary }} />
        </Box>
      ) : courses.length === 0 ? (
        <Box textAlign="center" pt={8}>
          <Typography fontSize={40} mb={1}>📚</Typography>
          <Typography color={S.muted}>No courses yet. Create your first one!</Typography>
        </Box>
      ) : (
        courses.map(course => (
          <CourseCard
            key={course._id}
            course={course}
            onRefresh={fetchCourses}
            setSnack={setSnack}
          />
        ))
      )}

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnackState(p => ({ ...p, open: false }))}
        message={snack.message}
      />
    </Box>
  );
}