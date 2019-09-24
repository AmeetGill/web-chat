class Html:
	def __init__(self):
		self.tag_string = "<html>{}</html>"
		self.children_tag = None
	
	def generate_html(self):
		print(self.tag_string.format(self.children_teg.generate()))